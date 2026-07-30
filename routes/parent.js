const express = require("express");

const {
    requireRole
} = require("../middleware/auth");


const parentController =
    require("../controllers/parentController");


const router = express.Router();


// ========================================
// PARENT DASHBOARD
// ========================================

router.get(

    "/parent/dashboard",

    requireRole("parent"),

    parentController.dashboard

);


module.exports = router;