const express =
    require("express");

const router =
    express.Router();

const {
    requireRole
} = require("../middleware/auth");

const upload =
    require("../middleware/mediaUpload");

const Lesson =
    require("../models/Lesson");

const MediaRecording =
    require("../models/MediaRecording");

const db =
    require("../database/database");


// ========================================
// TEACHER UPLOAD LESSON MEDIA
// AUDIO / VIDEO
// ========================================

router.post(

    "/teacher/lessons/:id/recording",

    requireRole("teacher", "admin"),

    upload.single("recording"),

    (req, res) => {

        try {

            const lessonId =
                req.params.id;


            // ========================================
            // FIND LESSON
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
            // VERIFY TEACHER OWNS THE COURSE
            // ========================================

            if (
                req.session.student.role === "teacher"
            ) {

                const course =
                    db.prepare(`

                        SELECT
                            id,
                            teacher_id

                        FROM courses

                        WHERE id = ?

                    `).get(
                        lesson.course_id
                    );


                if (
                    !course ||
                    course.teacher_id !==
                    req.session.student.id
                ) {

                    return res.status(403).json({

                        success: false,

                        message:
                            "You are not authorised to record media for this lesson."

                    });

                }

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
            // TEACHER ID
            // ========================================

            const teacherId =
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
                MediaRecording.createRecording(

                    teacherId,

                    lessonId,

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
                "Lesson media upload error:",
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


module.exports =
    router;