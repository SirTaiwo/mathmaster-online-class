const Assessment =
    require("../models/Assessment");


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