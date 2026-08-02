const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const ClassModel = require("../models/Class");


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

// =========================
// Class Attendance Page
// =========================

exports.classAttendance = (req, res) => {

    const classes = ClassModel.findAll();

    let students = [];

    if (req.query.class_id) {

        students =
            Attendance.getStudentsByClass(
                req.query.class_id
            );

    }

    res.render(
        "teacher-class-attendance",
        {
            user: req.session.student,
            classes,
            students,
            selectedClass:
                req.query.class_id || null
        }
    );

};

// =========================
// SAVE CLASS ATTENDANCE
// =========================

exports.saveClassAttendance = (req, res) => {

    const {

        attendance_date,

        student_id,

        status

    } = req.body;

    const records =
        student_id.map((id, index) => ({

            student_id: id,

            attendance_date,

            status: status[index],

            remarks: ""

        }));

    Attendance.createClassAttendance(records);

    res.redirect(
        "/teacher/class-attendance"
    );

};