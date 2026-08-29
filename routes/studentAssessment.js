const express = require("express");

const router = express.Router();

const {
    requireRole
} = require("../middleware/auth");

const {
    requirePaymentAccess
} = require("../middleware/paymentAccess");

const studentAssessmentController =
    require("../controllers/studentAssessmentController");


// ========================================
// LIST ASSESSMENTS
// ========================================

router.get(

    "/student/lessons/:lessonId/assessments",

    requireRole("student"),
    requirePaymentAccess,

    studentAssessmentController.listAssessments

);


// ========================================
// START ASSESSMENT
// ========================================

router.get(

    "/student/assessments/:assessmentId",

    requireRole("student"),
    requirePaymentAccess,

    studentAssessmentController.takeAssessment

);


// ========================================
// SUBMIT ASSESSMENT
// ========================================

router.post(

    "/student/assessments/:assessmentId",

    requireRole("student"),
    requirePaymentAccess,

    studentAssessmentController.submitAssessment

);



module.exports = router;

