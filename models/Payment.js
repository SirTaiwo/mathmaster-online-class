const db =
    require("../database/database");

const Receipt =
    require("./Receipt");


// ========================================
// CREATE PAYMENT
// UPDATE INVOICE AND STUDENT FEE
// ========================================

function createPayment(
    invoice_id,
    student_id,
    amount_paid,
    payment_method,
    reference_number
) {

    const transaction = db.transaction(() => {

        // ----------------------------------------
        // FIND INVOICE
        // ----------------------------------------

        const invoice = db.prepare(`

            SELECT

                id,
                student_id,
                student_fee_id,
                amount,
                amount_paid,
                balance

            FROM invoices

            WHERE id = ?

        `).get(invoice_id);


        if (!invoice) {

            throw new Error(
                "Invoice not found."
            );

        }




        // ----------------------------------------
        // VERIFY STUDENT
        // ----------------------------------------

        if (
            Number(invoice.student_id) !==
            Number(student_id)
        ) {

            throw new Error(
                "Invoice does not belong to this student."
            );

        }


        // ----------------------------------------
        // VALIDATE PAYMENT
        // ----------------------------------------

        const paymentAmount =
            Number(amount_paid);


        if (
            !Number.isFinite(paymentAmount) ||
            paymentAmount <= 0
        ) {

            throw new Error(
                "Payment amount must be greater than zero."
            );

        }


        // ----------------------------------------
        // PREVENT OVERPAYMENT
        // ----------------------------------------

        if (
            paymentAmount >
            Number(invoice.balance)
        ) {

            throw new Error(
                "Payment cannot exceed the outstanding balance."
            );

        }


        // ----------------------------------------
        // RECORD PAYMENT
        // ----------------------------------------

        const paymentResult =
            db.prepare(`

                INSERT INTO payments
                (
                    invoice_id,
                    student_id,
                    amount_paid,
                    payment_method,
                    reference_number
                )

                VALUES (?, ?, ?, ?, ?)

            `).run(

                invoice_id,
                student_id,
                paymentAmount,
                payment_method,
                reference_number

            );


        // ----------------------------------------
        // UPDATE INVOICE
        // ----------------------------------------

        const newAmountPaid =
            Number(invoice.amount_paid || 0) +
            paymentAmount;


        const newBalance =
            Number(invoice.amount) -
            newAmountPaid;


        let status =
            "Outstanding";


        if (newBalance <= 0) {

            status = "Paid";

        }
        else if (newAmountPaid > 0) {

            status = "Partially Paid";

        }


        db.prepare(`

            UPDATE invoices

            SET

                amount_paid = ?,

                balance = ?,

                status = ?

            WHERE id = ?

        `).run(

            newAmountPaid,

            newBalance,

            status,

            invoice_id

        );


        // ----------------------------------------
        // UPDATE STUDENT FEE ACCOUNT
        // ----------------------------------------

        const fee =
            db.prepare(`

                SELECT

                    amount_due

                FROM student_fees

                WHERE id = ?

            `).get(
                invoice.student_fee_id
            );


        if (!fee) {

            throw new Error(
                "Student fee account not found."
            );

        }


        const feeAmountPaid =
            db.prepare(`

                SELECT

                    COALESCE(
                        SUM(amount_paid),
                        0
                    ) AS total_paid

                FROM payments

                WHERE invoice_id = ?

            `).get(invoice_id);


        const feePaid =
            Number(
                feeAmountPaid.total_paid || 0
            );


        let feeStatus =
            "Outstanding";


        if (
            feePaid >=
            Number(fee.amount_due)
        ) {

            feeStatus = "Paid";

        }
        else if (feePaid > 0) {

            feeStatus = "Partially Paid";

        }


        db.prepare(`

            UPDATE student_fees

            SET

                amount_paid = ?,

                status = ?

            WHERE id = ?

        `).run(

            feePaid,

            feeStatus,

            invoice.student_fee_id

        );

                // ----------------------------------------
        // CREATE RECEIPT
        // ----------------------------------------

        const receiptNumber =
            "REC-" +
            String(
                paymentResult.lastInsertRowid
            ).padStart(6, "0");


        Receipt.createReceipt(

            receiptNumber,

            paymentResult.lastInsertRowid,

            student_id,

            paymentAmount

        );


        return paymentResult;

    });


    return transaction();

}



// ========================================
// FIND ALL PAYMENTS
// ========================================

function findAll() {


    return db.prepare(`

        SELECT

        payments.*,

        students.first_name,

        students.last_name,

        invoices.invoice_number


        FROM payments


        JOIN students

        ON payments.student_id = students.id


        JOIN invoices

        ON payments.invoice_id = invoices.id


        ORDER BY payments.created_at DESC


    `).all();

}



// ========================================
// FIND PAYMENTS BY INVOICE
// ========================================

function findByInvoice(invoice_id) {


    return db.prepare(`

        SELECT *

        FROM payments

        WHERE invoice_id = ?


        ORDER BY created_at DESC


    `).all(invoice_id);

}

// ========================================
// FIND PAYMENTS BY STUDENT
// ========================================

function findByStudent(student_id) {


    return db.prepare(`

        SELECT

        payments.*,

        invoices.invoice_number


        FROM payments


        JOIN invoices

        ON payments.invoice_id = invoices.id


        WHERE payments.student_id = ?


        ORDER BY payments.created_at DESC


    `).all(student_id);

}



module.exports = {

    createPayment,

    findAll,

    findByInvoice,

    findByStudent

};