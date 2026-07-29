const express = require("express");

const router = express.Router();


const {
    requireRole
} = require("../middleware/auth");


const controller =
    require("../controllers/teacherAssessmentController");


// ========================================
// VIEW ASSESSMENT RESULTS
// ========================================

router.get(

    "/teacher/assessments/:id/results",

    requireRole("teacher", "admin"),

    controller.results

);


module.exports = router;