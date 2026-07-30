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


module.exports = router;