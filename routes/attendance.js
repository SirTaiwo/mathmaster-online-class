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



module.exports = router;