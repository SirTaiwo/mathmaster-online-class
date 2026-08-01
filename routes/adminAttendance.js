const express = require("express");

const router = express.Router();


const {
    requireRole
} = require("../middleware/auth");


const controller =
require("../controllers/adminAttendanceController");


// ========================================
// ADMIN ATTENDANCE REPORT
// ========================================

router.get(

    "/admin/attendance",

    requireRole("admin"),

    controller.report

);


module.exports = router;