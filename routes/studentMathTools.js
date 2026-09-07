const express = require("express");

const studentMathToolsController =
    require("../controllers/studentMathToolsController");

const {
    requireRole
} = require("../middleware/auth");

const router = express.Router();


// ========================================
// STUDENT MATHEMATICS LIBRARY
// ========================================

router.get(
    "/student/math-tools",
    requireRole("student"),
    studentMathToolsController.index
);


// ========================================
// STUDENT CALCULATOR
// ========================================

router.get(
    "/student/math-tools/calculator",
    requireRole("student"),
    studentMathToolsController.calculator
);


// ========================================
// STUDENT GEOMETRY
// ========================================

router.get(
    "/student/math-tools/geometry",
    requireRole("student"),
    studentMathToolsController.geometry
);


// ========================================
// STUDENT GRAPHING
// ========================================

router.get(
    "/student/math-tools/graphing",
    requireRole("student"),
    studentMathToolsController.graphing
);


// ========================================
// STUDENT FORMULA LIBRARY
// ========================================

router.get(
    "/student/math-tools/formulas",
    requireRole("student"),
    studentMathToolsController.formulas
);


// ========================================
// STUDENT STATISTICS
// ========================================

router.get(
    "/student/math-tools/statistics",
    requireRole("student"),
    studentMathToolsController.statistics
);


module.exports = router;
