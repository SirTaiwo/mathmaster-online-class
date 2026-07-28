const express = require("express");

const router = express.Router();

const {
    requireRole
} = require("../middleware/auth");


const exerciseController =
    require("../controllers/exerciseController");



// CREATE EXERCISE FORM

router.get(
    "/teacher/lessons/:lessonId/exercises/create",
    requireRole("teacher", "admin"),
    exerciseController.createExerciseForm
);



// SAVE EXERCISE

router.post(
    "/teacher/lessons/:lessonId/exercises/create",
    requireRole("teacher", "admin"),
    exerciseController.createExercise
);
// ========================================
// STUDENT VIEW EXERCISE
// ========================================

router.get(
    "/student/exercises/:id",
    requireRole("student"),
    exerciseController.viewExercise
);



// ========================================
// STUDENT SUBMIT ANSWER
// ========================================

router.post(
    "/student/exercises/:id/submit",
    requireRole("student"),
    exerciseController.submitAnswer
);


module.exports = router;