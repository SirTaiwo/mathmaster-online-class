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

            performance,

            status

        }

    );


};

// ========================================
// PERFORMANCE STATUS
// ========================================

let status =
    {
        label: "Needs Support",
        icon: "🔴"
    };


const average =
    performance.average_percentage || 0;


if (average >= 80) {

    status = {

        label: "Excellent",
        icon: "🟢"

    };

}

else if (average >= 60) {

    status = {

        label: "Good",
        icon: "🔵"

    };

}

else if (average >= 40) {

    status = {

        label: "Needs Improvement",
        icon: "🟡"

    };

}