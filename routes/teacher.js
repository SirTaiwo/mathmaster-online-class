const express = require("express");

const {
    requireRole
} = require("../middleware/auth");

const teacherController =
    require("../controllers/teacherController");

const router = express.Router();

const mathToolsController =
    require("../controllers/mathToolsController");


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

// ========================================
// STUDENT ANALYTICS API
// ========================================

router.get(
    "/teacher/student-analytics/:id",
    requireRole("teacher", "admin"),
    teacherController.studentAnalytics
);

// ========================================
// TEACHER MATHEMATICS TOOLS
// ========================================

router.get(
    "/teacher/math-tools",
    requireRole("teacher", "admin"),
    mathToolsController.index
);

// ========================================
// TEACHER GEOMETRY TOOLS
// ========================================

router.get(
    "/teacher/math-tools/geometry",
    requireRole("teacher", "admin"),
    mathToolsController.geometry
);


// ========================================
// TEACHER GRAPHING TOOLS
// ========================================

router.get(
    "/teacher/math-tools/graphing",
    requireRole("teacher", "admin"),
    mathToolsController.graphing
);

// ========================================
// TEACHER FORMULA LIBRARY
// ========================================

router.get(
    "/teacher/math-tools/formulas",
    requireRole("teacher", "admin"),
    mathToolsController.formulas
);

module.exports = router;