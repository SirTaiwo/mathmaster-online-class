const express = require("express");

const {
    requireRole
} = require("../middleware/auth");


const teacherController =
    require("../controllers/teacherController");


const router = express.Router();


// ========================================
// TEACHER DASHBOARD
// ========================================

router.get(
    "/teacher/dashboard",
    requireRole("teacher", "admin"),
    teacherController.dashboard
);


module.exports = router;