const Submission =
    require("../models/Submission");

const Course =
    require("../models/Course");

    const Gradebook =
    require("../models/Gradebook");


// ========================================
// ALL SUBMISSIONS
// ========================================

exports.index = (req, res) => {


   const submissions =
    Submission.findAll();

const summary =
    Submission.getGradebookSummary();

    const studentSummaries =
    Submission.getStudentGradebookSummary();

    const scorePercentage =
    summary.total_possible_marks > 0
        ? Math.round(
            (summary.total_marks /
                summary.total_possible_marks) * 100
          )
        : 0;


    res.render(
        "teacher-gradebook",
        {

            user:
                req.session.student,

            submissions,

            summary,

            studentSummaries,

            scorePercentage

        }
    );


};
// ========================================
// COURSE GRADEBOOK
// ========================================

exports.courseGradebook = (req, res) => {


    const course =
        Course.findById(
            req.params.courseId
        );


    if (!course) {

        return res.redirect(
            "/teacher/courses"
        );

    }


    const students =
        Submission.findCoursePerformance(
            req.params.courseId
               ).map(student => {

            const scorePercentage =
                student.total_possible_marks > 0
                    ? Math.round(
                        (student.marks /
                         student.total_possible_marks) * 100
                      )
                    : 0;

            let performanceStatus = "No Activity";
            let performanceIcon = "⚪";

            if (student.attempts > 0) {

                if (scorePercentage >= 80) {

                    performanceStatus = "Excellent";
                    performanceIcon = "🟢";

                }

                else if (scorePercentage >= 70) {

                    performanceStatus = "Good";
                    performanceIcon = "🔵";

                }

                else if (scorePercentage >= 50) {

                    performanceStatus = "Satisfactory";
                    performanceIcon = "🟡";

                }

                else {

                    performanceStatus = "Needs Improvement";
                    performanceIcon = "🔴";

                }

            }

            return {

                ...student,

                scorePercentage,

                performanceStatus,

                performanceIcon

            };

        });

    res.render(
        "course-gradebook",
        {

            user:
                req.session.student,

            course,

            students

        }
    );


};
// ========================================
// ASSESSMENT GRADEBOOK
// ========================================

exports.assessmentGradebook = (req, res) => {

    const teacherId =
        req.session.student.id;

        // ========================================
// TOP PERFORMING STUDENTS
// ========================================

const topStudents =
    Gradebook.getTopStudents(
        teacherId
    );


// ========================================
// ASSESSMENT PERFORMANCE ANALYSIS
// ========================================

const assessmentPerformance =
    Gradebook.getAssessmentPerformanceAnalysis(
        teacherId
    );


    // ========================================
    // ALL ASSESSMENT RESULTS
    // ========================================

  const results =
    Gradebook.getTeacherResults(
        teacherId
    );


    // ========================================
    // TEACHER-SPECIFIC GRADEBOOK ANALYTICS
    // ========================================

    const teacherAnalytics =
        Gradebook.getTeacherAnalytics(
            teacherId
        );

    const analytics = {

        attempts:
            teacherAnalytics.total_attempts || 0,

        average_percentage:
            teacherAnalytics.average_score || 0,

        highest_percentage:
            teacherAnalytics.highest_score || 0,

        lowest_percentage:
            teacherAnalytics.lowest_score || 0

    };

    // ========================================
    // PERFORMANCE DISTRIBUTION
    // ========================================

    const performance =
        Gradebook.getTeacherPerformanceDistribution(
            teacherId
        );


    // ========================================
    // PASS / SUPPORT RATES
    // ========================================

    const totalAttempts =
        analytics.attempts || 0;


    const passingAttempts =
        performance.excellent +
        performance.good +
        performance.satisfactory;


    const passRate =
        totalAttempts > 0
            ? Math.round(
                (passingAttempts /
                    totalAttempts) * 100
            )
            : 0;


    const supportRate =
        totalAttempts > 0
            ? Math.round(
                (performance.support /
                    totalAttempts) * 100
            )
            : 0;


    // ========================================
    // STUDENTS WITH ASSESSMENT RESULTS
    // ========================================

    const students =
        Gradebook.getStudentsWithResults(
            teacherId
        );


    // ========================================
    // SELECTED STUDENT
    // ========================================

    const selectedStudentId =
        req.query.studentId
            ? Number(req.query.studentId)
            : null;


    let studentTrend = [];

    let selectedStudent = null;

    let studentTrendAnalytics = null;

    let studentTrendDirection = "No trend";

    let latestScore = null;

    let previousScore = null;

    let scoreChange = null;


    if (selectedStudentId) {

        selectedStudent =
            students.find(
                student =>
                    student.id ===
                    selectedStudentId
            );


        // Only load the trend if the
        // selected student belongs
        // to this teacher's results.

        if (selectedStudent) {

            studentTrend =
                Gradebook.getStudentPerformanceTrend(
                    teacherId,
                    selectedStudentId
                );

            // ========================================
            // STUDENT PERFORMANCE TREND DIRECTION
            // ========================================

            if (studentTrend.length >= 2) {

                const firstScore =
                    Number(studentTrend[0].percentage || 0);

                const lastScore =
                    Number(
                        studentTrend[studentTrend.length - 1].percentage || 0
                    );

                const scoreDifference =
                    lastScore - firstScore;

                if (scoreDifference >= 5) {

                    studentTrendDirection = "Improving";

                } else if (scoreDifference <= -5) {

                    studentTrendDirection = "Declining";

                } else {

                    studentTrendDirection = "Stable";

                }

            } else if (studentTrend.length === 1) {

                studentTrendDirection = "Insufficient data";

            }

            // ========================================
            // LATEST ASSESSMENT PERFORMANCE
            // ========================================

            if (studentTrend.length >= 2) {

                previousScore =
                    Number(
                        studentTrend[
                            studentTrend.length - 2
                        ].percentage || 0
                    );

                latestScore =
                    Number(
                        studentTrend[
                            studentTrend.length - 1
                        ].percentage || 0
                    );

                scoreChange =
                    latestScore - previousScore;

            } else if (studentTrend.length === 1) {

                latestScore =
                    Number(
                        studentTrend[0].percentage || 0
                    );

            }

        }

        // ========================================
// SELECTED STUDENT TREND ANALYTICS
// ========================================

if (selectedStudent) {

    studentTrendAnalytics =
        Gradebook.getStudentTrendAnalytics(
            teacherId,
            selectedStudentId
        );

}

    }


    // ========================================
    // RENDER GRADEBOOK
    // ========================================

    res.render(

        "teacher-assessment-gradebook",

        {

            user:
                req.session.student,

            results,

            analytics,

            performance,

            passRate,

            supportRate,

            students,

            selectedStudent,

            studentTrend,

            studentTrendAnalytics,

            studentTrendDirection,

            latestScore,

            previousScore,

            scoreChange,

            topStudents,

            assessmentPerformance

        }

    );

};