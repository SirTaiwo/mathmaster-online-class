const StudentFeedback =
    require("../models/StudentFeedback");


// ========================================
// SAVE FEEDBACK
// ========================================

exports.saveFeedback = (req, res) => {


    const studentId =
        req.params.id;


    const teacherId =
        req.session.student.id;


    const feedback =
        req.body.feedback;



    StudentFeedback.createFeedback(

        studentId,

        teacherId,

        feedback

    );


    res.redirect(

        `/teacher/students/${studentId}/performance`

    );


};