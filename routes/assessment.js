const express = require("express");

const router = express.Router();

const {
    requireRole
} = require("../middleware/auth");

const assessmentController =
    require("../controllers/assessmentController");


// ========================================
// CREATE ASSESSMENT
// ========================================

router.get(
    "/teacher/courses/:courseId/lessons/:lessonId/assessments/create",
    requireRole("teacher", "admin"),
    assessmentController.createAssessmentForm
);

router.post(
    "/teacher/courses/:courseId/lessons/:lessonId/assessments/create",
    requireRole("teacher", "admin"),
    assessmentController.createAssessment
);


// ========================================
// VIEW QUESTIONS
// ========================================

router.get(
    "/teacher/assessments/:assessmentId/questions",
    requireRole("teacher", "admin"),
    assessmentController.viewQuestions
);


// ========================================
// CREATE QUESTION
// ========================================

router.get(
    "/teacher/assessments/:assessmentId/questions/create",
    requireRole("teacher", "admin"),
    assessmentController.createQuestionForm
);

router.post(
    "/teacher/assessments/:assessmentId/questions/create",
    requireRole("teacher", "admin"),
    assessmentController.createQuestion
);

module.exports = router;