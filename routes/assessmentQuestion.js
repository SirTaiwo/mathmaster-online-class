const express = require("express");

const router = express.Router();

const {
    requireRole
} = require("../middleware/auth");

const controller =
    require("../controllers/assessmentQuestionController");


// ADD QUESTION FORM

router.get(

    "/teacher/assessments/:assessmentId/questions/create",

    requireRole("teacher", "admin"),

    controller.createQuestionForm

);


// SAVE QUESTION

router.post(

    "/teacher/assessments/:assessmentId/questions/create",

    requireRole("teacher", "admin"),

    controller.createQuestion

);


// VIEW QUESTIONS

router.get(

    "/teacher/assessments/:assessmentId/questions",

    requireRole("teacher", "admin"),

    controller.listQuestions

);
// ========================================
// EDIT QUESTION FORM
// ========================================

router.get(

    "/teacher/questions/:id/edit",

    requireRole("teacher", "admin"),

    controller.editQuestionForm

);


// ========================================
// UPDATE QUESTION
// ========================================

router.post(

    "/teacher/questions/:id/edit",

    requireRole("teacher", "admin"),

    controller.updateQuestion

);
// ========================================
// DELETE QUESTION
// ========================================

router.post(

    "/teacher/questions/:id/delete",

    requireRole("teacher", "admin"),

    controller.deleteQuestion

);


module.exports = router;