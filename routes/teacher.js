const express = require("express");

const {
    requireRole
} = require("../middleware/auth");

const teacherController =
    require("../controllers/teacherController");

const router = express.Router();


router.get(
    "/teacher/dashboard",
    requireRole("teacher", "admin"),
    teacherController.dashboard
);
// ========================================
// TEACHER STUDENTS
// ========================================

router.get(
    "/teacher/students",
    requireRole("teacher", "admin"),
    teacherController.students
);

module.exports = router;