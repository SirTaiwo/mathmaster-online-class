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
    // PERFORMANCE INSIGHT
    // ========================================

    let insight = {

        icon: "📊",

        title: "Performance Insight",

        latestScore: null,

        previousScore: null,

        difference: null,

        message: "No assessment data is available yet."

    };


    if (trend.length > 0) {

        const latestScore =
            Number(trend[trend.length - 1].percentage) || 0;


        if (trend.length === 1) {

            insight = {

                icon: "📊",

                title: "First Assessment",

                latestScore,

                previousScore: null,

                difference: null,

                message:
                    "This is the student's first recorded assessment."

            };

        }

        else {

            const previousScore =
                Number(trend[trend.length - 2].percentage) || 0;


            const difference =
                latestScore - previousScore;


            if (difference > 0) {

                insight = {

                    icon: "📈",

                    title: "Strong Improvement",

                    latestScore,

                    previousScore,

                    difference,

                    message:
                        "The latest assessment shows improvement compared with the previous attempt."

                };

            }

            else if (difference < 0) {

                insight = {

                    icon: "📉",

                    title: "Performance Decline",

                    latestScore,

                    previousScore,

                    difference,

                    message:
                        "The latest assessment score is lower than the previous attempt."

                };

            }

            else {

                insight = {

                    icon: "➡️",

                    title: "Performance Stable",

                    latestScore,

                    previousScore,

                    difference: 0,

                    message:
                        "The latest assessment score is unchanged from the previous attempt."

                };

            }

        }

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

            trend,

            insight

        }

    );

};
