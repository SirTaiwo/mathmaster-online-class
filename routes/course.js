const express = require("express");

const {
    requireRole
} = require("../middleware/auth");


const courseController =
    require("../controllers/courseController");


const router = express.Router();


// ========================================
// TEACHER COURSES
// ========================================

router.get(
    "/teacher/courses",
    requireRole("teacher", "admin"),
    courseController.myCourses
);


// ========================================
// CREATE COURSE FORM
// ========================================

router.get(
    "/teacher/courses/create",
    requireRole("teacher", "admin"),
    courseController.createCourseForm
);


// ========================================
// SAVE COURSE
// ========================================

router.post(
    "/teacher/courses/create",
    requireRole("teacher", "admin"),
    courseController.createCourse
);


// ========================================
// DELETE COURSE
// ========================================

router.get(
    "/teacher/courses/delete/:id",
    requireRole("teacher", "admin"),
    courseController.deleteCourse
);


module.exports = router;