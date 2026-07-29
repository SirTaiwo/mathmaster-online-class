const Submission =
    require("../models/Submission");

const Course =
    require("../models/Course");

    const Gradebook =
    require("../models/Gradebook");


// ========================================
// ALL SUBMISSIONS
// ========================================

exports.index = (req, res) => {


    const submissions =
        Submission.findAll();


    res.render(
        "teacher-gradebook",
        {

            user:
                req.session.student,

            submissions

        }
    );


};
// ========================================
// COURSE GRADEBOOK
// ========================================

exports.courseGradebook = (req, res) => {


    const course =
        Course.findById(
            req.params.courseId
        );


    if (!course) {

        return res.redirect(
            "/teacher/courses"
        );

    }


    const students =
        Submission.findCoursePerformance(
            req.params.courseId
        );



    res.render(
        "course-gradebook",
        {

            user:
                req.session.student,

            course,

            students

        }
    );


};
// ========================================
// ASSESSMENT GRADEBOOK
// ========================================

// ========================================
// ASSESSMENT GRADEBOOK
// ========================================

exports.assessmentGradebook = (req, res) => {


    const results =
        Gradebook.getAllResults();


    const analytics =
        Gradebook.getAnalytics();


    res.render(

        "teacher-assessment-gradebook",

        {

            user:
                req.session.student,

            results,

            analytics

        }

    );


};