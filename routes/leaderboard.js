const express = require("express");

const router = express.Router();

const {
    requireRole
} = require("../middleware/auth");

const leaderboardController =
    require("../controllers/leaderboardController");


// ========================================
// STUDENT LEADERBOARD
// ========================================

router.get(

    "/teacher/leaderboard",

    requireRole("teacher", "admin"),

    leaderboardController.index

);

module.exports = router;
