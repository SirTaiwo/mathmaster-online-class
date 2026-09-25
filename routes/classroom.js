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



// ========================================
// STUDENT JOIN LIVE CLASSROOM
// ========================================

router.get(
    "/student/courses/:courseId/classroom",
    requireRole("student"),
    classroomController.joinSession
);


// ========================================
// STUDENT CLASSROOM INTERACTION
// ========================================

router.post(
    "/student/courses/:courseId/classroom/interaction",
    requireRole("student"),
    classroomController.submitInteraction
);


// ========================================
// STUDENT CLASSROOM WRITTEN MESSAGE
// ========================================

router.post(
    "/student/courses/:courseId/classroom/message",
    requireRole("student"),
    classroomController.submitMessage
);

// ========================================
// TEACHER CLASSROOM MESSAGE RESPONSE
// ========================================

router.post(
    "/teacher/classroom/message/:messageId/respond",
    requireRole("teacher"),
    classroomController.respondToMessage
);

// ========================================
// TEACHER ACKNOWLEDGE CLASSROOM INTERACTION
// ========================================

router.post(
    "/teacher/classroom/interaction/:interactionId/acknowledge",
    requireRole("teacher"),
    classroomController.acknowledgeInteraction
);


module.exports = router;
