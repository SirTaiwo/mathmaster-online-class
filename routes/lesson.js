const express = require("express");

const {
    requireRole
} = require("../middleware/auth");


const lessonController =
    require("../controllers/lessonController");


const router = express.Router();


// ========================================
// VIEW COURSE LESSONS
// ========================================

router.get(
    "/teacher/courses/:courseId/lessons",
    requireRole("teacher", "admin"),
    lessonController.lessons
);


// ========================================
// CREATE LESSON FORM
// ========================================

router.get(
    "/teacher/courses/:courseId/lessons/create",
    requireRole("teacher", "admin"),
    lessonController.createLessonForm
);


// ========================================
// SAVE LESSON
// ========================================

router.post(
    "/teacher/courses/:courseId/lessons/create",
    requireRole("teacher", "admin"),
    lessonController.createLesson
);


// ========================================
// DELETE LESSON
// ========================================

router.get(
    "/teacher/courses/:courseId/lessons/delete/:id",
    requireRole("teacher", "admin"),
    lessonController.deleteLesson
);


module.exports = router;