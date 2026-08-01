const db =
    require("../database/database");


// ========================================
// CREATE INVOICE
// ========================================

function createInvoice(
    invoice_number,
    student_id,
    student_fee_id,
    description,
    amount
) {


    const balance = amount;


    return db.prepare(`

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

        invoice_number,
        student_id,
        student_fee_id,
        description,
        amount,
        balance

    );

}



// ========================================
// FIND ALL INVOICES
// ========================================

function findAll() {


    return db.prepare(`

        SELECT

        invoices.*,

        students.first_name,

        students.last_name


        FROM invoices


        JOIN students

        ON invoices.student_id = students.id


        ORDER BY invoices.created_at DESC


    `).all();

}



// ========================================
// FIND STUDENT INVOICES
// ========================================

function findByStudent(student_id) {


    return db.prepare(`

        SELECT *

        FROM invoices

        WHERE student_id = ?


        ORDER BY created_at DESC


    `).all(student_id);

}



// ========================================
// FIND ONE INVOICE
// ========================================

function findById(id) {


    return db.prepare(`

        SELECT *

        FROM invoices

        WHERE id = ?

    `).get(id);

}



module.exports = {

    createInvoice,

    findAll,

    findByStudent,

    findById

};