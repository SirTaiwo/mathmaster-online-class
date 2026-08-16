const express = require("express");

const {
    requireRole
} = require("../middleware/auth");

const controller =
    require("../controllers/studentFinanceController");

const router = express.Router();


// ========================================
// STUDENT FINANCE DASHBOARD
// ========================================

router.get(
    "/student/finance",
    requireRole("student"),
    controller.index
);


module.exports = router;
