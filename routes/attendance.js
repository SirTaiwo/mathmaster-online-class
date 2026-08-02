const express = require("express");

const router = express.Router();

const controller =
require("../controllers/attendanceController");


const {
    requireRole
} = require("../middleware/auth");



// Attendance page

router.get(

    "/teacher/attendance",

    requireRole("teacher", "admin"),

    controller.index

);



// Save attendance

router.post(

    "/teacher/attendance",

    requireRole("teacher", "admin"),

    controller.create

);

// ========================================
// CLASS ATTENDANCE
// ========================================

router.get(

    "/teacher/class-attendance",

    requireRole("teacher", "admin"),

    controller.classAttendance

);


// ========================================
// SAVE CLASS ATTENDANCE
// ========================================

router.post(

    "/teacher/class-attendance",

    requireRole("teacher", "admin"),

    controller.saveClassAttendance

);



module.exports = router;