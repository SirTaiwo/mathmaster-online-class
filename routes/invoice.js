const express = require("express");

const {
    requireRole
} = require("../middleware/auth");


const invoiceController =
    require("../controllers/invoiceController");


const router = express.Router();


// ========================================
// ADMIN INVOICES
// ========================================

router.get(
    "/admin/invoices",
    requireRole("admin"),
    invoiceController.index
);


module.exports = router;