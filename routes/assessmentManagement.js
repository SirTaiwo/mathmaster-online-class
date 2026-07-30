const express =
    require("express");


const router =
    express.Router();


const {
    requireRole
}
=
require("../middleware/auth");


const controller =
    require("../controllers/assessmentManagementController");


// ========================================
// TEACHER ASSESSMENTS
// ========================================

router.get(

    "/teacher/assessments",

    requireRole("teacher", "admin"),

    controller.index

);

// ========================================
// EDIT ASSESSMENT FORM
// ========================================

router.get(

    "/teacher/assessments/:id/edit",

    requireRole("teacher", "admin"),

    controller.editForm

);


// ========================================
// UPDATE ASSESSMENT
// ========================================

router.post(

    "/teacher/assessments/:id/edit",

    requireRole("teacher", "admin"),

    controller.update

);

// ========================================
// DELETE ASSESSMENT
// ========================================

router.post(

    "/teacher/assessments/:id/delete",

    requireRole("teacher", "admin"),

    controller.delete

);


module.exports = router;