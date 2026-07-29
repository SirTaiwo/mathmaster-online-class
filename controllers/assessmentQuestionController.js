const Assessment =
    require("../models/Assessment");

const AssessmentQuestion =
    require("../models/AssessmentQuestion");


// ========================================
// ADD QUESTION FORM
// ========================================

exports.createQuestionForm = (req, res) => {

    const assessment =
        Assessment.findById(
            req.params.assessmentId
        );

    if (!assessment) {

        return res.redirect(
            "/teacher/courses"
        );

    }

    res.render(
        "create-assessment-question",
        {

            user:
                req.session.student,

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


// ========================================
// VIEW QUESTIONS
// ========================================

exports.listQuestions = (req, res) => {

    const assessment =
        Assessment.findById(
            req.params.assessmentId
        );

    if (!assessment) {

        return res.redirect(
            "/teacher/courses"
        );

    }

    const questions =
        AssessmentQuestion.findByAssessment(
            req.params.assessmentId
        );

    res.render(
        "assessment-questions",
        {

            user:
                req.session.student,

            assessment,

            questions

        }
    );

};

// ========================================
// EDIT QUESTION FORM
// ========================================

exports.editQuestionForm = (req, res) => {

    const question =
        AssessmentQuestion.findById(
            req.params.id
        );

    if (!question) {

        return res.redirect(
            "/teacher/courses"
        );

    }

    res.render(
        "edit-assessment-question",
        {

            user:
                req.session.student,

            question

        }
    );

};
// ========================================
// UPDATE QUESTION
// ========================================

exports.updateQuestion = (req, res) => {

    const {
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        marks
    } = req.body;


    AssessmentQuestion.updateQuestion(

        req.params.id,

        question,

        option_a,

        option_b,

        option_c,

        option_d,

        correct_answer,

        marks

    );


    const currentQuestion =
        AssessmentQuestion.findById(
            req.params.id
        );

    res.redirect(

        `/teacher/assessments/${currentQuestion.assessment_id}/questions`

    );

};
// ========================================
// DELETE QUESTION
// ========================================

exports.deleteQuestion = (req, res) => {

    const question =
        AssessmentQuestion.findById(
            req.params.id
        );

    if (!question) {

        return res.redirect(
            "/teacher/courses"
        );

    }

    AssessmentQuestion.deleteQuestion(
        req.params.id
    );

    res.redirect(

        `/teacher/assessments/${question.assessment_id}/questions`

    );

};