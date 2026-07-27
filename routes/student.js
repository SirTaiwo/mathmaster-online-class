const express = require("express");

const studentController =
    require("../controllers/studentController");

const {
    requireRole
} = require("../middleware/auth");

const router = express.Router();


// ========================================
// STUDENT DASHBOARD
// ========================================

router.get(
    "/student/dashboard",
    requireRole("student"),
    studentController.dashboard
);
// ========================================
// ADMIN STUDENT MANAGEMENT
// ========================================

router.get(
    "/admin/students",
    requireRole("admin"),
    studentController.listStudents
);
// ========================================
// ADMIN CREATE STUDENT
// ========================================

router.post(
    "/admin/students/create",
    requireRole("admin"),
    studentController.createStudent
);
// ========================================
// EDIT STUDENT - DISPLAY FORM
// ========================================

router.get(
    "/admin/students/edit/:id",
    requireRole("admin"),
    studentController.editStudentForm
);


// ========================================
// EDIT STUDENT - SAVE CHANGES
// ========================================

router.post(
    "/admin/students/edit/:id",
    requireRole("admin"),
    studentController.updateStudent
);


// ========================================
// DELETE STUDENT
// ========================================

router.get(
    "/admin/students/delete/:id",
    requireRole("admin"),
    studentController.deleteStudent
);
// ========================================
// STUDENT COURSE LIST
// ========================================

router.get(
    "/student/courses",
    requireRole("student"),
    studentController.courses
);


// ========================================
// ENROLL COURSE
// ========================================

router.get(
    "/student/courses/enroll/:id",
    requireRole("student"),
    studentController.enroll
);
// ========================================
// STUDENT MY COURSES
// ========================================

router.get(
    "/student/my-courses",
    requireRole("student"),
    studentController.myCourses
);
// ========================================
// VIEW LESSONS FOR ENROLLED COURSE
// ========================================

router.get(
    "/student/courses/:courseId/lessons",
    requireRole("student"),
    studentController.courseLessons
);


module.exports = router;