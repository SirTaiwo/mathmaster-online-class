const Attendance = require("../models/Attendance");
const Student = require("../models/Student");


// =========================
// Attendance Page
// =========================

exports.index = (req, res) => {

    const students =
        Student.findAllStudents();

    const attendance =
        Attendance.findAll();

    res.render(
        "teacher-attendance",
        {
            students,
            attendance
        }
    );

};


// =========================
// Save Attendance
// =========================

exports.create = (req, res) => {

    const {

        student_id,

        course_id,

        attendance_date,

        status,

        remarks

    } = req.body;

    Attendance.createAttendance(

        student_id,

        course_id || null,

        attendance_date,

        status,

        remarks

    );

    res.redirect("/teacher/attendance");

};