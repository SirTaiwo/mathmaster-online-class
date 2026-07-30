const Assessment =
    require("../models/Assessment");

    const AssessmentQuestion =
    require("../models/AssessmentQuestion");

const AssessmentResult =
    require("../models/AssessmentResult");


// ========================================
// VIEW ALL ASSESSMENTS
// ========================================

exports.index = (req, res) => {


    const assessments =
        Assessment.findAll();


    res.render(

        "teacher-assessments",

        {

            user:
                req.session.student,

            assessments

        }

    );


};

// ========================================
// EDIT ASSESSMENT FORM
// ========================================

exports.editForm = (req, res) => {

    const assessment =
        Assessment.findById(
            req.params.id
        );

    if (!assessment) {

        return res.redirect(
            "/teacher/assessments"
        );

    }

    res.render(

        "edit-assessment",

        {

            user:
                req.session.student,

            assessment

        }

    );

};


// ========================================
// UPDATE ASSESSMENT
// ========================================

exports.update = (req, res) => {

    const {

        title,

        description,

        totalMarks

    } = req.body;


    Assessment.updateAssessment(

        req.params.id,

        title,

        description,

        totalMarks

    );


    res.redirect(
        "/teacher/assessments"
    );

};

// ========================================
// DELETE ASSESSMENT
// ========================================

exports.delete = (req, res) => {

    const assessment =
        Assessment.findById(
            req.params.id
        );

    if (!assessment) {

        return res.redirect(
            "/teacher/assessments"
        );

    }

    // Remove student results
    AssessmentResult.deleteByAssessment(
        req.params.id
    );

    // Remove assessment questions
    AssessmentQuestion.deleteByAssessment(
        req.params.id
    );

    // Remove assessment
    Assessment.deleteAssessment(
        req.params.id
    );

    res.redirect(
        "/teacher/assessments"
    );

};