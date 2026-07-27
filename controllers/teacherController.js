const Student =
    require("../models/Student");

const Enrollment =
    require("../models/Enrollment");

const Course =
    require("../models/Course");


// ========================================
// TEACHER DASHBOARD
// ========================================

exports.dashboard = (req, res) => {


    const teacher =
        Student.findById(
            req.session.student.id
        );


    if (!teacher) {

        return req.session.destroy(() => {

            res.redirect("/login");

        });

    }


    const teacherId =
        teacher.id;


    const courses =
        Course.countByTeacher(
            teacherId
        );


    const enrolledStudents =
        Enrollment.findStudentsByTeacher(
            teacherId
        );


    const stats = {

        classes:
            courses.total,

        students:
            enrolledStudents.length,

        assignments: 0,

        assessments: 0

    };


    res.render(
        "teacher-dashboard",
        {
            user: teacher,

            stats
        }
    );

};
// ========================================
// TEACHER VIEW STUDENTS
// ========================================

exports.students = (req, res) => {


    const teacherId =
        req.session.student.id;


    const courses =
        Course.findByTeacher(
            teacherId
        );


    let students = [];


    courses.forEach(course => {

        const enrolled =
            Enrollment.findStudentsByCourse(
                course.id
            );


        students.push(
            ...enrolled
        );

    });


    res.render(
        "teacher-students",
        {

            user:
                req.session.student,

            students,

            courses

        }
    );

};