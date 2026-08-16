const express = require("express");

const router = express.Router();

const {
    requireRole
} = require("../middleware/auth");


const controller =
    require("../controllers/studentPerformanceController");


// ========================================
// VIEW STUDENT PERFORMANCE
// ========================================

router.get(

    "/teacher/students/:id/performance",

    requireRole("teacher"),

    controller.viewPerformance

);

const studentFeedbackController =
    require("../controllers/studentFeedbackController");


// ========================================
// SAVE STUDENT FEEDBACK
// ========================================

router.post(

    "/teacher/students/:id/feedback",

    requireRole("teacher"),

    studentFeedbackController.saveFeedback

);

// ========================================
// STUDENT - VIEW OWN PERFORMANCE
// ========================================

router.get(

    "/student/performance",

    requireRole("student"),

    controller.studentPerformance

);


module.exports = router;