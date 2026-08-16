const express =
    require("express");

const {
    requireRole
} = require("../middleware/auth");

const controller =
    require("../controllers/studentAttendanceController");


const router =
    express.Router();


// ========================================
// STUDENT ATTENDANCE
// ========================================

router.get(

    "/student/attendance",

    requireRole("student"),

    controller.index

);


module.exports = router;
