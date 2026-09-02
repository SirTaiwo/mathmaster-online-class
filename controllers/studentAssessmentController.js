const Assessment =
    require("../models/Assessment");

const AssessmentQuestion =
    require("../models/AssessmentQuestion");

const AssessmentResult =
    require("../models/AssessmentResult");

const Lesson =
    require("../models/Lesson");

const Enrollment =
    require("../models/Enrollment");


// ========================================
// CHECK STUDENT ENROLLMENT
// ========================================

function isStudentEnrolledInAssessment(
    studentId,
    assessment
) {

    const lesson =
        Lesson.findById(
            assessment.lesson_id
        );

    if (!lesson) {
        return false;
    }

    return !!Enrollment.isStudentEnrolled(
        studentId,
        lesson.course_id
    );

}


// ========================================
// LIST ASSESSMENTS
// ========================================

exports.listAssessments = (req, res) => {

    const studentId =
        req.session.student.id;

    const lesson =
        Lesson.findById(
            req.params.lessonId
        );

    if (!lesson) {

        return res.redirect(
            "/student/my-courses"
        );

    }

    if (
        !Enrollment.isStudentEnrolled(
            studentId,
            lesson.course_id
        )
    ) {

        return res.redirect(
            "/student/my-courses"
        );

    }

    const assessments =
        Assessment.findByLesson(
            req.params.lessonId
        );

    res.render(
        "student-assessments",
        {
            user: req.session.student,
            assessments,
            lessonId: req.params.lessonId
        }
    );

};


// ========================================
// START ASSESSMENT
// ========================================

exports.takeAssessment = (req, res) => {

    const assessment =
        Assessment.findById(
            req.params.assessmentId
        );

    if (!assessment) {

        return res.redirect(
            "/student/dashboard"
        );

    }

    const studentId =
        req.session.student.id;

    if (
        !isStudentEnrolledInAssessment(
            studentId,
            assessment
        )
    ) {

        return res.redirect(
            "/student/my-courses"
        );

    }

    const attempts =
        AssessmentResult.countAttempts(
            studentId,
            req.params.assessmentId
        );


    if (
        attempts.attempts >=
        assessment.max_attempts
    ) {

        return res.render(
            "assessment-limit",
            {
                user: req.session.student,
                assessment,
                attempts: attempts.attempts
            }
        );

    }


    const questions =
        AssessmentQuestion.findByAssessment(
            req.params.assessmentId
        );

    res.render(
        "student-assessment",
        {
            user: req.session.student,
            assessment,
            questions
        }
    );

};


// ========================================
// SUBMIT ASSESSMENT AND MARK
// ========================================

exports.submitAssessment = (req, res) => {

    const assessmentId =
        req.params.assessmentId;

    const studentId =
        req.session.student.id;

    const assessment =
        Assessment.findById(
            assessmentId
        );

    if (!assessment) {

        return res.redirect(
            "/student/dashboard"
        );

    }

    if (
        !isStudentEnrolledInAssessment(
            studentId,
            assessment
        )
    ) {

        return res.redirect(
            "/student/my-courses"
        );

    }

    const attempts =
        AssessmentResult.countAttempts(
            studentId,
            assessmentId
        );

    if (
        attempts.attempts >=
        assessment.max_attempts
    ) {

        return res.render(
            "assessment-limit",
            {
                user: req.session.student,
                assessment,
                attempts: attempts.attempts
            }
        );

    }

    const questions =
        AssessmentQuestion.findByAssessment(
            assessmentId
        );

    let score = 0;

    let totalMarks = 0;

    questions.forEach(question => {

        const answer =
            req.body[
                `question_${question.id}`
            ];

        totalMarks += question.marks;

        if (
            answer &&
            answer === question.correct_answer
        ) {

            score += question.marks;

        }

    });

    const percentage =
        totalMarks
            ? Math.round(
                (score / totalMarks) * 100
              )
            : 0;

    AssessmentResult.saveResult(
        studentId,
        assessmentId,
        score,
        totalMarks,
        percentage
    );

    res.render(
        "assessment-result",
        {
            user: req.session.student,
            score,
            totalMarks,
            percentage
        }
    );

};
