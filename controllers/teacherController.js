const Student =
    require("../models/Student");

const Enrollment =
    require("../models/Enrollment");

const Course =
    require("../models/Course");

const Gradebook =
    require("../models/Gradebook");

const AssessmentResult =
    require("../models/AssessmentResult");



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

    const analytics =
    Gradebook.getTeacherAnalytics(
        teacherId
    );

    const passRate =
    Gradebook.getPassRate(
        teacherId
    );


const distribution =
    Gradebook.getTeacherPerformanceDistribution(
        teacherId
    );


const topStudents =
    Gradebook.getTopStudents(
        teacherId
    );

    const progressTrend =
    AssessmentResult.getProgressTrend(
        1
    );


res.render(
    "teacher-dashboard",
    {
        user: teacher,

        stats,

        analytics,
        students: enrolledStudents,

        progressTrend,

        passRate,

        distribution,

        topStudents,

        progressTrend

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

// ========================================
// STUDENT ANALYTICS API
// ========================================

exports.studentAnalytics = (req, res) => {


    const studentId =
        req.params.id;


    const performance =
        AssessmentResult.getStudentPerformance(
            studentId
        );


    const progressTrend =
        AssessmentResult.getProgressTrend(
            studentId
        );


    res.json({

        performance,

        progressTrend

    });


};