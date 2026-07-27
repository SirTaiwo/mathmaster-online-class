const express = require("express");

    const adminController =
    require("../controllers/adminController");

const {
    requireRole
} = require("../middleware/auth");

const router = express.Router();


// ========================================
// ADMIN DASHBOARD
// ========================================

router.get(
    "/admin/dashboard",
    requireRole("admin"),
    adminController.dashboard
);


// ========================================
// MANAGE USERS
// ========================================

router.get(
    "/admin/users",
    requireRole("admin"),
    adminController.users
);


// ========================================
// CREATE TEACHER
// ========================================

router.post(
    "/admin/users/teacher",
    requireRole("admin"),
    adminController.createTeacher
);
// ========================================
// EDIT USER - DISPLAY FORM
// ========================================

router.get(
    "/admin/users/edit/:id",
    requireRole("admin"),
    adminController.editUserForm
);
// ========================================
// DELETE USER
// ========================================

router.get(
    "/admin/users/delete/:id",
    requireRole("admin"),
    adminController.deleteUser
);
// ========================================
// EDIT USER - SAVE CHANGES
// ========================================

router.post(
    "/admin/users/edit/:id",
    requireRole("admin"),
    adminController.updateUser
);



module.exports = router;