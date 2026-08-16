const db = require("../database/database");


function createReceipt(
    receipt_number,
    payment_id,
    student_id,
    amount
){

    return db.prepare(`

        INSERT INTO receipts
        (
            receipt_number,
            payment_id,
            student_id,
            amount
        )

        VALUES
        (?, ?, ?, ?)

    `).run(
        receipt_number,
        payment_id,
        student_id,
        amount
    );

}



function findAll(){

    return db.prepare(`

        SELECT
            receipts.*,

            students.first_name,
            students.last_name,

            payments.payment_method,
            payments.reference_number,

            invoices.invoice_number


        FROM receipts


        JOIN students
        ON receipts.student_id = students.id


        JOIN payments
        ON receipts.payment_id = payments.id


        JOIN invoices
        ON payments.invoice_id = invoices.id


        ORDER BY receipts.created_at DESC


    `).all();

}



function findById(id){

    return db.prepare(`

        SELECT
            receipts.*,

            students.first_name,
            students.last_name,

            payments.payment_method,
            payments.reference_number,

            invoices.invoice_number


        FROM receipts


        JOIN students
        ON receipts.student_id = students.id


        JOIN payments
        ON receipts.payment_id = payments.id


        JOIN invoices
        ON payments.invoice_id = invoices.id


        WHERE receipts.id = ?

    `).get(id);

}

function findByStudent(studentId){

    return db.prepare(`

        SELECT
            receipts.*,

            payments.payment_method,
            payments.reference_number,

            invoices.invoice_number

        FROM receipts

        JOIN payments
        ON receipts.payment_id = payments.id

        JOIN invoices
        ON payments.invoice_id = invoices.id

        WHERE receipts.student_id = ?

        ORDER BY receipts.created_at DESC

    `).all(studentId);

}



module.exports = {

    createReceipt,
    findAll,
    findById,
    findByStudent

};