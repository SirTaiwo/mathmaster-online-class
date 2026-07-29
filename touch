const express =
    require("express");

const router =
    express.Router();

const {
    requireRole
} =
require("../middleware/auth");


const controller =
    require("../controllers/gradebookController");


// ========================================
// ASSESSMENT GRADEBOOK
// ========================================

router.get(

    "/teacher/assessment-gradebook",

    requireRole("teacher", "admin"),

    controller.assessmentGradebook

);


module.exports = router;