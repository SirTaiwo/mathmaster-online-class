const express = require("express");

const router = express.Router();

const {
    requireRole
} = require("../middleware/auth");

const studentAssessmentController =
    require("../controllers/studentAssessmentController");


// ========================================
// LIST ASSESSMENTS
// ========================================

router.get(

    "/student/lessons/:lessonId/assessments",

    requireRole("student"),

    studentAssessmentController.listAssessments

);


// ========================================
// START ASSESSMENT
// ========================================

router.get(

    "/student/assessments/:assessmentId",

    requireRole("student"),

    studentAssessmentController.takeAssessment

);


// ========================================
// SUBMIT ASSESSMENT
// ========================================

router.post(

    "/student/assessments/:assessmentId",

    requireRole("student"),

    studentAssessmentController.submitAssessment

);



module.exports = router;

