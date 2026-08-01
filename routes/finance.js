const express = require("express");

const router = express.Router();

const {
    requireRole
} = require("../middleware/auth");

const financeController =
    require("../controllers/financeController");

// ========================================
// ADMIN FINANCE DASHBOARD
// ========================================

router.get(

    "/admin/finance",

    requireRole("admin"),

    financeController.index

);

// ========================================
// CREATE FEE STRUCTURE
// ========================================

router.post(

    "/admin/finance/create",

    requireRole("admin"),

    financeController.create

);

// ========================================
// DELETE FEE STRUCTURE
// ========================================

router.post(

    "/admin/finance/delete/:id",

    requireRole("admin"),

    financeController.delete

);

module.exports = router;