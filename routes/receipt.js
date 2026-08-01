const express = require("express");

const router = express.Router();


const controller =
require("../controllers/receiptController");


const {
    requireRole
} = require("../middleware/auth");



router.get(
    "/admin/receipts",
    requireRole("admin"),
    controller.index
);



router.post(
    "/admin/receipts/create",
    requireRole("admin"),
    controller.create
);



router.get(
    "/admin/receipts/:id",
    requireRole("admin"),
    controller.view
);



module.exports = router;