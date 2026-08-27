const express =
    require("express");

const router =
    express.Router();

const {
    requireRole
} = require("../middleware/auth");

const upload =
    require("../middleware/materialUpload");

const lessonMaterialController =
    require("../controllers/lessonMaterialController");


// ========================================
// TEACHER UPLOAD LEARNING MATERIAL
// ========================================

router.post(

    "/teacher/lessons/:lessonId/materials",

    requireRole("teacher", "admin"),

    upload.single("material"),

    lessonMaterialController.uploadMaterial

);


// ========================================
// DELETE LEARNING MATERIAL
// ========================================

router.get(

    "/teacher/lessons/:lessonId/materials/delete/:id",

    requireRole("teacher", "admin"),

    lessonMaterialController.deleteMaterial

);


module.exports =
    router;
