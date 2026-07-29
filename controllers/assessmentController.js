const Assessment =
    require("../models/Assessment");

const Lesson =
    require("../models/Lesson");
    const AssessmentQuestion =
    require("../models/AssessmentQuestion");


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

        totalMarks

    } = req.body;



    Assessment.createAssessment(

        req.params.lessonId,

        title,

        description,

        totalMarks

    );


    res.redirect(
        `/teacher/lessons/${req.params.lessonId}`
    );


};
// ========================================
// VIEW QUESTIONS
// ========================================

exports.viewQuestions = (req, res) => {

    const assessment =
        Assessment.findById(
            req.params.assessmentId
        );

    const questions =
        AssessmentQuestion.findByAssessment(
            req.params.assessmentId
        );

    res.render(
        "assessment-questions",
        {
            user: req.session.student,
            assessment,
            questions
        }
    );

};


// ========================================
// CREATE QUESTION FORM
// ========================================

exports.createQuestionForm = (req, res) => {

    const assessment =
        Assessment.findById(
            req.params.assessmentId
        );

    res.render(
        "create-assessment-question",
        {
            user: req.session.student,
            assessment
        }
    );

};


// ========================================
// SAVE QUESTION
// ========================================

exports.createQuestion = (req, res) => {

    const {
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        marks
    } = req.body;

    AssessmentQuestion.createQuestion(

        req.params.assessmentId,

        question,

        option_a,

        option_b,

        option_c,

        option_d,

        correct_answer,

        marks

    );

    res.redirect(
        `/teacher/assessments/${req.params.assessmentId}/questions`
    );

};