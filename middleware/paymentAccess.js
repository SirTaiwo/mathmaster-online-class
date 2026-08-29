const db =
    require("../database/database");


// ========================================
// REQUIRE STUDENT PAYMENT CLEARANCE
// ========================================
//
// Students must have no outstanding invoice
// balance before accessing the learning portal.
//
// Finance remains accessible separately so the
// student can review their account.
//

function requirePaymentAccess(req, res, next) {

    // ----------------------------------------
    // REQUIRE AUTHENTICATED STUDENT
    // ----------------------------------------

    if (
        !req.session ||
        !req.session.student
    ) {

        return res.redirect("/login");

    }


    // ----------------------------------------
    // ONLY APPLY TO STUDENTS
    // ----------------------------------------

    if (
        req.session.student.role !== "student"
    ) {

        return next();

    }


    const studentId =
        req.session.student.id;


    // ----------------------------------------
    // CALCULATE CURRENT OUTSTANDING BALANCE
    // ----------------------------------------

    const result =
        db.prepare(`

            SELECT
                COALESCE(
                    SUM(
                        CASE
                            WHEN balance > 0
                            THEN balance
                            ELSE 0
                        END
                    ),
                    0
                ) AS total_balance

            FROM invoices

            WHERE student_id = ?

        `).get(studentId);


    const totalBalance =
        Number(result.total_balance || 0);


    // ----------------------------------------
    // PAYMENT CLEAR
    // ----------------------------------------

    if (totalBalance <= 0) {

        return next();

    }


    // ----------------------------------------
    // PAYMENT REQUIRED
    // ----------------------------------------

    return res.status(402).render(
        "payment-required",
        {
            user:
                req.session.student,

            totalBalance
        }
    );

}


module.exports = {
    requirePaymentAccess
};
