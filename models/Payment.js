const db =
    require("../database/database");


// ========================================
// CREATE PAYMENT
// ========================================

function createPayment(
    invoice_id,
    student_id,
    amount_paid,
    payment_method,
    reference_number
) {


    return db.prepare(`

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
        amount_paid,
        payment_method,
        reference_number

    );

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