const Assessment =
    require("../models/Assessment");

const Lesson =
    require("../models/Lesson");


// ========================================
// CREATE ASSESSMENT FORM
// ========================================

exports.createAssessmentForm = (req, res) => {


    const lesson =
        Lesson.findById(
            req.params.lessonId
        );


    if (!lesson) {

        return res.redirect(
            "/teacher/courses"
        );

    }


res.render(
    "create-assessment",
    {

        user:
            req.session.student,

        lesson,

        courseId: req.params.courseId,

        error: null,

        success: null

    }
);


};



// ========================================
// SAVE ASSESSMENT
// ========================================

exports.createAssessment = (req, res) => {


    const {

        title,

        description,

        totalMarks,

        maxAttempts

    } = req.body;



    Assessment.createAssessment(

        req.params.lessonId,

        title,

        description,

        totalMarks,
        
        maxAttempts

    );


    res.redirect(
        `/teacher/lessons/${req.params.lessonId}`
    );


};
