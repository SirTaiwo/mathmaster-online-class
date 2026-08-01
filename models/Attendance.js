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

// ===============================
// OVERALL ATTENDANCE SUMMARY
// ===============================

function getAttendanceSummary() {

    return db.prepare(`

        SELECT

            status,

            COUNT(*) AS total

        FROM attendance

        GROUP BY status

    `).all();

}



// ===============================
// STUDENT ATTENDANCE SUMMARY
// ===============================

function getStudentAttendanceSummary(student_id) {

    return db.prepare(`

        SELECT

            COUNT(*) AS total,

            SUM(status = 'Present') AS present,

            SUM(status = 'Absent') AS absent,

            SUM(status = 'Late') AS late,

            SUM(status = 'Excused') AS excused

        FROM attendance

        WHERE student_id = ?

    `).get(student_id);

}



// ===============================
// DAILY ATTENDANCE SUMMARY
// ===============================

function getDailyAttendanceSummary(date) {

    return db.prepare(`

        SELECT

            status,

            COUNT(*) AS total

        FROM attendance

        WHERE attendance_date = ?

        GROUP BY status

    `).all(date);

}

// ===============================
// STUDENT ATTENDANCE RANKING
// ===============================

function getStudentAttendanceRanking() {

    return db.prepare(`

        SELECT

            students.first_name,

            students.last_name,

            COUNT(attendance.id) AS total,

            SUM(attendance.status = 'Present') AS present,

            ROUND(

                (SUM(attendance.status = 'Present') * 100.0)

                /

                COUNT(attendance.id)

            ,1) AS attendance_rate


        FROM attendance


        JOIN students

            ON attendance.student_id = students.id


        GROUP BY attendance.student_id


        ORDER BY attendance_rate DESC


    `).all();

}

// ===============================
// LOW ATTENDANCE STUDENTS
// ===============================

function getLowAttendanceStudents() {

    return db.prepare(`

        SELECT

            students.first_name,

            students.last_name,

            COUNT(attendance.id) AS total,

            ROUND(

                (SUM(attendance.status = 'Present') * 100.0)

                /

                COUNT(attendance.id)

            ,1) AS attendance_rate


        FROM attendance


        JOIN students

            ON attendance.student_id = students.id


        GROUP BY attendance.student_id


        HAVING attendance_rate < 75


        ORDER BY attendance_rate ASC


    `).all();

}

// ===============================
// MONTHLY ATTENDANCE TREND
// ===============================

function getMonthlyAttendanceTrend() {

    return db.prepare(`

        SELECT

            strftime('%Y-%m', attendance_date) AS month,

            COUNT(*) AS total,

            SUM(status = 'Present') AS present,

            ROUND(
                (SUM(status = 'Present') * 100.0)
                /
                COUNT(*),
                2
            ) AS attendance_rate


        FROM attendance

        GROUP BY month

        ORDER BY month ASC


    `).all();

}



module.exports = {

    createAttendance,

    findAll,

    findByStudent,

    findByDate,

    updateAttendance,

    getAttendanceSummary,

    getStudentAttendanceSummary,

    getDailyAttendanceSummary,

    getStudentAttendanceRanking,

    getLowAttendanceStudents,

    getMonthlyAttendanceTrend

};