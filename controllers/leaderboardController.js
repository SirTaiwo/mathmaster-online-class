const AssessmentResult =
    require("../models/AssessmentResult");


// ========================================
// STUDENT LEADERBOARD
// ========================================

exports.index = (req, res) => {

    const leaderboard =
        AssessmentResult.leaderboard();

    res.render(

        "teacher-leaderboard",

        {

            user:
                req.session.student,

            leaderboard

        }

    );

};