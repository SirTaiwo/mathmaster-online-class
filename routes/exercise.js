const express = require("express");

const router = express.Router();

const {
    requireRole
} = require("../middleware/auth");


const exerciseController =
    require("../controllers/exerciseController");

const upload =
    require("../middleware/mediaUpload");

const Exercise =
    require("../models/Exercise");

    const {
    requirePaymentAccess
} = require("../middleware/paymentAccess");

const StudentMediaRecording =
    require("../models/StudentMediaRecording");



// CREATE EXERCISE FORM

router.get(
    "/teacher/lessons/:lessonId/exercises/create",
    requireRole("teacher", "admin"),
    exerciseController.createExerciseForm
);



// SAVE EXERCISE

router.post(
    "/teacher/lessons/:lessonId/exercises/create",
    requireRole("teacher", "admin"),
    exerciseController.createExercise
);
// ========================================
// STUDENT VIEW EXERCISE
// ========================================

router.get(
    "/student/exercises/:id",
    requireRole("student"),
    requirePaymentAccess,
    exerciseController.viewExercise
);



// ========================================
// STUDENT SUBMIT ANSWER
// ========================================

router.post(
    "/student/exercises/:id/submit",
    requireRole("student"),
    requirePaymentAccess,
    exerciseController.submitAnswer
);

// ========================================
// STUDENT EXERCISE MEDIA RECORDING
// AUDIO / VIDEO
// ========================================

router.post(

    "/student/exercises/:id/recording",

    requireRole("student"),
    requirePaymentAccess,

    upload.single("recording"),

    (req, res) => {

        try {

            const exerciseId =
                req.params.id;


            // ========================================
            // FIND EXERCISE
            // ========================================

            const exercise =
                Exercise.findById(
                    exerciseId
                );


            if (!exercise) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Exercise not found."

                });

            }


            // ========================================
            // CHECK UPLOAD
            // ========================================

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    message:
                        "No recording was uploaded."

                });

            }


            // ========================================
            // STUDENT ID
            // ========================================

            const studentId =
                req.session.student.id;


            // ========================================
            // DETERMINE MEDIA TYPE
            // ========================================

            const mediaType =
                req.body.recordingType === "video"
                    ? "video"
                    : "audio";


            // ========================================
            // DETERMINE MIME TYPE
            // ========================================

            const mimeType =
                mediaType === "video"
                    ? "video/webm"
                    : "audio/webm";


            // ========================================
            // FILE PATH
            // ========================================

            const filePath =
                "/media/recordings/" +
                req.file.filename;


            // ========================================
            // SAVE RECORDING
            // ========================================

            const result =
                StudentMediaRecording.createRecording(

                    studentId,

                    exerciseId,

                    mediaType,

                    filePath,

                    mimeType,

                    null,

                    req.file.size

                );


            // ========================================
            // RESPONSE
            // ========================================

            return res.json({

                success: true,

                recording_id:
                    result.lastInsertRowid,

                media_type:
                    mediaType,

                mime_type:
                    mimeType,

                file_path:
                    filePath,

                file_size:
                    req.file.size

            });

        } catch (error) {

            console.error(
                "Student exercise media upload error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to save the recording."

            });

        }

    }

);


module.exports = router;