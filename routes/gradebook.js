const express = require("express");

const router = express.Router();

const {
    requireRole
} = require("../middleware/auth");


const gradebookController =
    require("../controllers/gradebookController");


// ========================================
// ALL EXERCISE SUBMISSIONS
// ========================================

router.get(
    "/teacher/gradebook",
    requireRole("teacher", "admin"),
    gradebookController.index
);


// ========================================
// COURSE GRADEBOOK
// ========================================

router.get(
    "/teacher/courses/:courseId/gradebook",
    requireRole("teacher", "admin"),
    gradebookController.courseGradebook
);


module.exports = router;