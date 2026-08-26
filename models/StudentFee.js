const db =
    require("../database/database");


// ========================================
// FIND ALL STUDENT FEES
// ========================================

function findAll() {

    return db.prepare(`

        SELECT

            student_fees.*,

            students.first_name,

            students.last_name,

            students.grade,

            fee_structures.description

        FROM student_fees


        JOIN students

        ON student_fees.student_id =
           students.id


        JOIN fee_structures

        ON student_fees.fee_structure_id =
           fee_structures.id


        ORDER BY student_fees.created_at DESC


    `).all();

}


// ========================================
// FIND FEES BY STUDENT
// ========================================

function findByStudent(studentId) {

    return db.prepare(`

        SELECT *

        FROM student_fees

        WHERE student_id = ?

        ORDER BY created_at DESC


    `).all(studentId);

}


// ========================================
// CREATE STUDENT FEE ACCOUNT
// AND AUTOMATICALLY CREATE INVOICE
// ========================================

function create(

    student_id,

    fee_structure_id,

    term,

    year,

    amount_due

) {

    const createFeeAndInvoice =
        db.transaction(() => {

            // --------------------------------
            // CREATE STUDENT FEE ACCOUNT
            // --------------------------------

            const feeResult =
                db.prepare(`

                    INSERT INTO student_fees
                    (
                        student_id,
                        fee_structure_id,
                        term,
                        year,
                        amount_due
                    )

                    VALUES (?, ?, ?, ?, ?)

                `).run(

                    student_id,

                    fee_structure_id,

                    term,

                    year,

                    amount_due

                );


            const studentFeeId =
                feeResult.lastInsertRowid;


            // --------------------------------
            // GET FEE DESCRIPTION
            // --------------------------------

            const feeStructure =
                db.prepare(`

                    SELECT description

                    FROM fee_structures

                    WHERE id = ?

                `).get(
                    fee_structure_id
                );


            const description =
                feeStructure &&
                feeStructure.description
                    ? feeStructure.description
                    : "School Fees";


            // --------------------------------
            // GENERATE NEXT INVOICE NUMBER
            // --------------------------------

            const invoiceNumberResult =
                db.prepare(`

                    SELECT
                        COALESCE(
                            MAX(
                                CAST(
                                    SUBSTR(invoice_number, 5)
                                    AS INTEGER
                                )
                            ),
                            0
                        ) + 1 AS next_number

                    FROM invoices

                    WHERE invoice_number LIKE 'INV-%'

                `).get();


            const nextNumber =
                invoiceNumberResult.next_number;


            const invoiceNumber =
                "INV-" +
                String(nextNumber).padStart(4, "0");


            // --------------------------------
            // CREATE INVOICE
            // --------------------------------

            db.prepare(`

                INSERT INTO invoices
                (
                    invoice_number,
                    student_id,
                    student_fee_id,
                    description,
                    amount,
                    balance
                )

                VALUES (?, ?, ?, ?, ?, ?)

            `).run(

                invoiceNumber,

                student_id,

                studentFeeId,

                description,

                amount_due,

                amount_due

            );


            return feeResult;

        });


    return createFeeAndInvoice();

}



module.exports = {

    findAll,

    findByStudent,

    create

};
