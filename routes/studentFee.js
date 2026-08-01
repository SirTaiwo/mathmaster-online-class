const express = require("express");

const router =
    express.Router();


const {
    requireRole
} = require("../middleware/auth");


const controller =
    require("../controllers/studentFeeController");


// ========================================
// VIEW STUDENT FEE ACCOUNTS
// ========================================

router.get(

    "/admin/student-fees",

    requireRole("admin"),

    controller.index

);


// ========================================
// CREATE STUDENT FEE ACCOUNT
// ========================================

router.post(

    "/admin/student-fees/create",

    requireRole("admin"),

    controller.create

);


module.exports = router;