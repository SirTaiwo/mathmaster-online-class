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


module.exports = router;