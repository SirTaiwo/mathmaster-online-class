const express =
    require("express");

const router =
    express.Router();

const {
    requireRole
} = require("../middleware/auth");

const upload =
    require("../middleware/mediaUpload");

const Exercise =
    require("../models/Exercise");

const Submission =
    require("../models/Submission");

const MediaRecording =
    require("../models/MediaRecording");


// ========================================
// STUDENT UPLOAD MEDIA RECORDING
// ========================================

router.post(

    "/student/exercises/:id/recording",

    requireRole("student"),

    upload.single("recording"),

    (req, res) => {

        const exercise =
            Exercise.findById(
                req.params.id
            );


        if (!exercise) {

            return res.status(404).json({

                success: false,

                message:
                    "Exercise not found."

            });

        }


        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "No recording was uploaded."

            });

        }


        const studentId =
            req.session.student.id;


        const submissions =
            Submission.findByStudentAndExercise(

                studentId,

                exercise.id

            );


        const latestSubmission =
            submissions &&
            submissions.length > 0
                ? submissions[0]
                : null;


        const submissionId =
            latestSubmission
                ? latestSubmission.id
                : null;


        const mediaType =
    req.body.recordingType === "video"
        ? "video"
        : "audio";

        const mimeType =
    mediaType === "video"
        ? "video/webm"
        : "audio/webm";


        const filePath =
            "/media/recordings/" +
            req.file.filename;


        const result =
            MediaRecording.createRecording(

                studentId,

                submissionId,

                mediaType,

                filePath,

                mimeType,

                null,

                req.file.size

            );


        return res.json({

            success: true,

            recording_id:
                result.lastInsertRowid,

            media_type:
                mediaType,

            file_path:
                filePath

        });

    }

);


module.exports =
    router;
