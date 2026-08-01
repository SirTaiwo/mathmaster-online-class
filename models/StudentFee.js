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
// ========================================

function create(

    student_id,

    fee_structure_id,

    term,

    year,

    amount_due

) {


    return db.prepare(`

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

}



module.exports = {

    findAll,

    findByStudent,

    create

};