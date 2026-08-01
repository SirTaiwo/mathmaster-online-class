const express = require("express");

const router = express.Router();

const {
    requireRole
} = require("../middleware/auth");


const controller =
    require("../controllers/adminClassController");


// ========================================
// VIEW CLASSES
// ========================================

router.get(
    "/admin/classes",
    requireRole("admin"),
    controller.index
);


// ========================================
// CREATE CLASS
// ========================================

router.post(
    "/admin/classes",
    requireRole("admin"),
    controller.create
);


// ========================================
// DELETE CLASS
// ========================================

router.get(
    "/admin/classes/delete/:id",
    requireRole("admin"),
    controller.delete
);

// ========================================
// CLASS DETAILS
// ========================================

router.get(
    "/admin/classes/:id",
    requireRole("admin"),
    controller.details
);


// ========================================
// ADD STUDENT
// ========================================

router.post(
    "/admin/classes/:id/student",
    requireRole("admin"),
    controller.addStudent
);


module.exports = router;