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


module.exports = router;
