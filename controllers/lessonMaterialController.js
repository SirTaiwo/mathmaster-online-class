const Lesson =
    require("../models/Lesson");

const LessonMaterial =
    require("../models/LessonMaterial");

    const fs =
    require("fs");

const path =
    require("path");

// ========================================
// UPLOAD LEARNING MATERIAL
// ========================================

exports.uploadMaterial = (req, res) => {

    try {

        const lessonId =
            req.params.lessonId;


        // ========================================
        // VERIFY LESSON
        // ========================================

        const lesson =
            Lesson.findById(
                lessonId
            );


        if (!lesson) {

            return res.status(404).json({

                success: false,

                message:
                    "Lesson not found."

            });

        }


        // ========================================
        // CHECK FILE
        // ========================================

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "No learning material was uploaded."

            });

        }


        // ========================================
        // TEACHER ID
        // ========================================

        const teacherId =
            req.session.student.id;


        // ========================================
        // MATERIAL DETAILS
        // ========================================

        const title =
            req.body.title ||
            req.file.originalname;

        const description =
            req.body.description ||
            null;


        const filePath =
            "/media/materials/" +
            req.file.filename;


        // ========================================
        // SAVE MATERIAL
        // ========================================

        const result =
            LessonMaterial.createMaterial(

                teacherId,

                lessonId,

                title,

                description,

                filePath,

                req.file.originalname,

                req.file.mimetype,

                req.file.size

            );


        // ========================================
        // RESPONSE
        // ========================================

        return res.json({

            success: true,

            material_id:
                result.lastInsertRowid,

            message:
                "Learning material uploaded successfully."

        });

    } catch (error) {

        console.error(
            "Learning material upload error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to save the learning material."

        });

    }

};


// ========================================
// DELETE LEARNING MATERIAL
// ========================================

exports.deleteMaterial = (req, res) => {

    try {

        const materialId =
            req.params.id;

        // ========================================
        // FIND MATERIAL
        // ========================================

        const material =
            LessonMaterial.findById(
                materialId
            );


        if (!material) {

            return res.status(404).send(
                "Learning material not found."
            );

        }


        // ========================================
        // BUILD PHYSICAL FILE PATH
        // ========================================

            const physicalPath =
            path.join(
                __dirname,
                "../public",
                material.file_path
            );


        // ========================================
        // DELETE PHYSICAL FILE
        // ========================================

        if (
            fs.existsSync(
                physicalPath
            )
        ) {

            fs.unlinkSync(
                physicalPath
            );

        }


        // ========================================
        // DELETE DATABASE RECORD
        // ========================================

        LessonMaterial.deleteMaterial(
            materialId
        );


        // ========================================
        // RETURN TO PREVIOUS PAGE
        // ========================================

const lesson =
    Lesson.findById(
        material.lesson_id
    );

if (!lesson) {

    return res.status(404).send(
        "Lesson not found."
    );

}

return res.redirect(
    "/teacher/courses/" +
    lesson.course_id +
    "/lessons"
);


    } catch (error) {

        console.error(
            "Learning material deletion error:",
            error
        );


        return res.status(500).send(
            "Unable to delete learning material."
        );

    }

};