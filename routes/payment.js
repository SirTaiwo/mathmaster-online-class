const express = require("express");

const {
    requireRole
} = require("../middleware/auth");


const controller =
    require("../controllers/paymentController");


const router = express.Router();



// VIEW PAYMENTS

router.get(

    "/admin/payments",

    requireRole("admin"),

    controller.index

);



// RECORD PAYMENT

router.post(

    "/admin/payments",

    requireRole("admin"),

    controller.create

);



module.exports = router;