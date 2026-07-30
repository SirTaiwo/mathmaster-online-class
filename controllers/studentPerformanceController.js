const Student =
    require("../models/Student");

const AssessmentResult =
    require("../models/AssessmentResult");


// ========================================
// VIEW STUDENT PERFORMANCE
// ========================================

exports.viewPerformance = (req, res) => {


    const studentId =
        req.params.id;


    const student =
        Student.findById(
            studentId
        );


    const results =
        AssessmentResult.findByStudent(
            studentId
        );


    const performance =
        AssessmentResult.getStudentPerformance(
            studentId
        );


    res.render(

        "student-performance",

        {

            user:
                req.session.student,

            student,

            results,

            performance

        }

    );


};