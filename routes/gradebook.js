const express = require("express");

const router = express.Router();

const {
    requireRole
} = require("../middleware/auth");


const gradebookController =
    require("../controllers/gradebookController");



// COURSE GRADEBOOK

router.get(
    "/teacher/courses/:courseId/gradebook",
    requireRole("teacher", "admin"),
    gradebookController.courseGradebook
);



module.exports = router;