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


    const trend =
        AssessmentResult.getProgressTrend(
            studentId
        );


    const performanceStatus =
        AssessmentResult.getPerformanceStatus(
            studentId
        );


    // ========================================
    // DISPLAY STATUS
    // ========================================

    let status = {

        label: performanceStatus,

        icon: "🔴"

    };


    if (performanceStatus === "Excellent") {

        status = {

            label: "Excellent",

            icon: "🟢"

        };

    }

    else if (performanceStatus === "Good") {

        status = {

            label: "Good",

            icon: "🔵"

        };

    }

    else if (performanceStatus === "Satisfactory") {

        status = {

            label: "Satisfactory",

            icon: "🟡"

        };

    }

    else if (
        performanceStatus === "Needs Improvement"
    ) {

        status = {

            label: "Needs Improvement",

            icon: "🔴"

        };

    }

    else if (
        performanceStatus === "No Data"
    ) {

        status = {

            label: "No Data",

            icon: "⚪"

        };

    }


    // ========================================
    // RENDER PERFORMANCE PAGE
    // ========================================

    res.render(

        "student-performance",

        {

            user:
                req.session.student,

            student,

            results,

            performance,

            status,

            trend

        }

    );

};
