const db =
require("../database/database");



// ===============================
// CREATE ATTENDANCE
// ===============================

function createAttendance(

    student_id,

    course_id,

    attendance_date,

    status,

    remarks

) {

    return db.prepare(`

        INSERT INTO attendance (

            student_id,

            course_id,

            attendance_date,

            status,

            remarks

        )

        VALUES (?, ?, ?, ?, ?)

    `).run(

        student_id,

        course_id,

        attendance_date,

        status,

        remarks

    );

}



// ===============================
// ALL ATTENDANCE
// ===============================

function findAll() {

    return db.prepare(`

        SELECT

            attendance.*,

            students.first_name,

            students.last_name

        FROM attendance

        JOIN students

            ON attendance.student_id = students.id

        ORDER BY attendance_date DESC

    `).all();

}



// ===============================
// BY STUDENT
// ===============================

function findByStudent(student_id) {

    return db.prepare(`

        SELECT *

        FROM attendance

        WHERE student_id = ?

        ORDER BY attendance_date DESC

    `).all(student_id);

}



// ===============================
// BY DATE
// ===============================

function findByDate(attendance_date) {

    return db.prepare(`

        SELECT *

        FROM attendance

        WHERE attendance_date = ?

    `).all(attendance_date);

}



// ===============================
// UPDATE
// ===============================

function updateAttendance(

    id,

    status,

    remarks

) {

    return db.prepare(`

        UPDATE attendance

        SET

            status = ?,

            remarks = ?

        WHERE id = ?

    `).run(

        status,

        remarks,

        id

    );

}



module.exports = {

    createAttendance,

    findAll,

    findByStudent,

    findByDate,

    updateAttendance

};