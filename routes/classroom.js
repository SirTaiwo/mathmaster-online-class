const express = require("express");

const {
    requireRole
} = require("../middleware/auth");


const classroomController =
    require("../controllers/classroomController");


const router = express.Router();


// ========================================
// START CLASSROOM SESSION
// ========================================

router.post(
    "/teacher/courses/:courseId/classroom/start",
    requireRole("teacher", "admin"),
    classroomController.startSession
);


// ========================================
// END CLASSROOM SESSION
// ========================================

router.post(
    "/teacher/classroom/:sessionId/end",
    requireRole("teacher", "admin"),
    classroomController.endSession
);


module.exports = router;
