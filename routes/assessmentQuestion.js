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


module.exports = router;