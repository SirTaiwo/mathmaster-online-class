const Assessment =
    require("../models/Assessment");

const AssessmentResult =
    require("../models/AssessmentResult");


// ========================================
// VIEW ASSESSMENT RESULTS
// ========================================

exports.results = (req, res) => {


    const assessment =
        Assessment.findById(
            req.params.id
        );


    if (!assessment) {

        return res.redirect(
            "/teacher/courses"
        );

    }


    const results =
        AssessmentResult.findByAssessment(
            req.params.id
        );


    const statistics = {

        attempts:
            results.length,


        average:

            results.length

            ?

            Math.round(

                results.reduce(

                    (total, item) =>
                        total + item.percentage,

                    0

                ) / results.length

            )

            :

            0,


        highest:

            results.length

            ?

            Math.max(

                ...results.map(

                    item =>
                        item.percentage

                )

            )

            :

            0,


        lowest:

            results.length

            ?

            Math.min(

                ...results.map(

                    item =>
                        item.percentage

                )

            )

            :

            0

    };


    res.render(

        "teacher-assessment-results",

        {

            user:
                req.session.student,

            assessment,

            results,

            statistics

        }

    );


};