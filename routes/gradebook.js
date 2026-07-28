const express = require("express");

const router = express.Router();

const {
    requireRole
} = require("../middleware/auth");


const gradebookController =
    require("../controllers/gradebookController");


// TEACHER GRADEBOOK

router.get(
    "/teacher/gradebook",
    requireRole("teacher", "admin"),
    gradebookController.index
);


module.exports = router;