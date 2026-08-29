const express = require("express");
const path = require("path");
const fs = require("fs");

const {
    requireLogin
} = require("../middleware/auth");

const MediaRecording =
    require("../models/MediaRecording");

const StudentMediaRecording =
    require("../models/StudentMediaRecording");

const LessonMaterial =
    require("../models/LessonMaterial");

const db =
    require("../database/database");

const {
    requirePaymentAccess
} = require("../middleware/paymentAccess");

const router = express.Router();


// ========================================
// PRIVATE RECORDING DIRECTORY
// ========================================

const recordingsDirectory =
    path.join(
        __dirname,
        "../private/media/recordings"
    );


// ========================================
// DETERMINE MIME TYPE
// ========================================

function getMimeType(
    recording
) {

    if (
        recording.mime_type &&
        (
            recording.mime_type === "audio/webm" ||
            recording.mime_type === "audio/ogg" ||
            recording.mime_type === "audio/mp4" ||
            recording.mime_type === "audio/mpeg" ||
            recording.mime_type === "video/webm" ||
            recording.mime_type === "video/mp4" ||
            recording.mime_type === "video/ogg"
        )
    ) {

        return recording.mime_type;

    }


    return recording.media_type === "video"
        ? "video/webm"
        : "audio/webm";

}


// ========================================
// CHECK TEACHER LESSON RECORDING ACCESS
// ========================================

function canAccessLessonRecording(
    req,
    recording
) {

    const user =
        req.session.student;


    // ADMIN

    if (
        user.role === "admin"
    ) {

        return true;

    }


    // TEACHER WHO OWNS THE COURSE

    if (
        user.role === "teacher"
    ) {

        const course =
            db.prepare(`

                SELECT
                    teacher_id

                FROM courses

                WHERE id = (

                    SELECT course_id

                    FROM lessons

                    WHERE id = ?

                )

            `).get(
                recording.lesson_id
            );


        return !!course &&
               course.teacher_id === user.id;

    }


    // STUDENT MUST BE ENROLLED

    if (
        user.role === "student"
    ) {

        const enrolled =
            db.prepare(`

                SELECT
                    enrollments.id

                FROM enrollments

                JOIN lessons
                    ON lessons.course_id =
                       enrollments.course_id

                WHERE enrollments.student_id = ?

                AND lessons.id = ?

                LIMIT 1

            `).get(

                user.id,

                recording.lesson_id

            );


        return !!enrolled;

    }


    return false;

}


// ========================================
// STREAM FILE
// ========================================

function streamRecording(
    req,
    res,
    recording
) {

    if (
        !recording.file_path
    ) {

        return res.status(404).send(
            "Recording file not found."
        );

    }


    const filename =
        path.basename(
            recording.file_path
        );


    const filePath =
        path.join(
            recordingsDirectory,
            filename
        );


    // SECURITY: prevent path traversal

    if (
        path.dirname(
            path.resolve(filePath)
        ) !==
        path.resolve(recordingsDirectory)
    ) {

        return res.status(403).send(
            "Invalid recording path."
        );

    }


    if (
        !fs.existsSync(filePath)
    ) {

        return res.status(404).send(
            "Recording file not found."
        );

    }


    const stat =
        fs.statSync(filePath);


    const fileSize =
        stat.size;


    const mimeType =
        getMimeType(
            recording
        );


    const range =
        req.headers.range;


    // ========================================
    // NORMAL REQUEST
    // ========================================

    if (!range) {

        res.writeHead(
            200,
            {
                "Content-Type":
                    mimeType,

                "Content-Length":
                    fileSize,

                "Accept-Ranges":
                    "bytes",

                "Content-Disposition":
                    "inline",

                "Cache-Control":
                    "private, no-store"
            }
        );


        return fs.createReadStream(
            filePath
        ).pipe(res);

    }


    // ========================================
    // RANGE REQUEST
    // ========================================

    const match =
        range.match(
            /bytes=(\d*)-(\d*)/
        );


    if (!match) {

        return res.status(416).end();

    }


    let start =
        match[1]
            ? parseInt(match[1], 10)
            : 0;


    let end =
        match[2]
            ? parseInt(match[2], 10)
            : fileSize - 1;


    if (
        start >= fileSize ||
        end >= fileSize ||
        start > end
    ) {

        return res.status(416).set({

            "Content-Range":
                `bytes */${fileSize}`

        }).end();

    }


    const chunkSize =
        end - start + 1;


    res.writeHead(
        206,
        {
            "Content-Range":
                `bytes ${start}-${end}/${fileSize}`,

            "Accept-Ranges":
                "bytes",

            "Content-Length":
                chunkSize,

            "Content-Type":
                mimeType,

            "Content-Disposition":
                "inline",

            "Cache-Control":
                "private, no-store"
        }
    );


    return fs.createReadStream(
        filePath,
        {
            start,
            end
        }
    ).pipe(res);

}


// ========================================
// PROTECTED LEARNING MATERIAL
// ========================================

router.get(

    "/media/lesson-materials/:id",

    requireLogin,

    (req, res, next) => {

        // Students must have cleared payment
        // before accessing learning materials.

        if (
            req.session.student &&
            req.session.student.role === "student"
        ) {

            return requirePaymentAccess(
                req,
                res,
                () => next()
            );

        }

        return next();

    },

    (req, res) => {

        const material =
            LessonMaterial.findById(
                req.params.id
            );


        if (!material) {

            return res.status(404).send(
                "Learning material not found."
            );

        }


        const user =
            req.session.student;


        // ========================================
        // ADMIN
        // ========================================

        if (
            user.role === "admin"
        ) {

            return streamLearningMaterial(
                req,
                res,
                material
            );

        }


        // ========================================
        // TEACHER
        // ========================================

        if (
            user.role === "teacher"
        ) {

            const course =
                db.prepare(`

                    SELECT
                        courses.teacher_id

                    FROM lessons

                    JOIN courses
                        ON courses.id =
                           lessons.course_id

                    WHERE lessons.id = ?

                `).get(
                    material.lesson_id
                );


            if (
                course &&
                course.teacher_id === user.id
            ) {

                return streamLearningMaterial(
                    req,
                    res,
                    material
                );

            }


            return res.status(403).send(
                "You are not authorised to view this learning material."
            );

        }


        // ========================================
        // STUDENT
        // ========================================

        if (
            user.role === "student"
        ) {

            const enrolled =
                db.prepare(`

                    SELECT
                        enrollments.id

                    FROM enrollments

                    JOIN lessons
                        ON lessons.course_id =
                           enrollments.course_id

                    WHERE enrollments.student_id = ?

                    AND lessons.id = ?

                    LIMIT 1

                `).get(

                    user.id,

                    material.lesson_id

                );


            if (!enrolled) {

                return res.status(403).send(
                    "You are not enrolled in this course."
                );

            }


            return streamLearningMaterial(
                req,
                res,
                material
            );

        }


        return res.status(403).send(
            "You are not authorised to view this learning material."
        );

    }

);



// ========================================
// STREAM LEARNING MATERIAL
// ========================================

function streamLearningMaterial(
    req,
    res,
    material
) {

    if (
        !material.file_path
    ) {

        return res.status(404).send(
            "Learning material file not found."
        );

    }


    const materialsDirectory =
        path.join(
            __dirname,
            "../private/media/materials"
        );


    const filename =
        path.basename(
            material.file_path
        );


    const filePath =
        path.join(
            materialsDirectory,
            filename
        );


    // SECURITY: prevent path traversal

    if (
        path.dirname(
            path.resolve(filePath)
        ) !==
        path.resolve(materialsDirectory)
    ) {

        return res.status(403).send(
            "Invalid learning material path."
        );

    }


    if (
        !fs.existsSync(filePath)
    ) {

        return res.status(404).send(
            "Learning material file not found."
        );

    }


    const stat =
        fs.statSync(filePath);


    const disposition =
        req.query.download === "1"
            ? "attachment"
            : "inline";


    res.writeHead(
        200,
        {
            "Content-Type":
                material.mime_type ||
                "application/octet-stream",

            "Content-Length":
                stat.size,

            "Content-Disposition":
                `${disposition}; filename="${encodeURIComponent(
                    material.original_filename || filename
                )}"`,

            "Cache-Control":
                "private, no-store"
        }
    );


    return fs.createReadStream(
        filePath
    ).pipe(res);

}



// ========================================
// TEACHER LESSON RECORDING
// ========================================

router.get(

    "/media/lesson-recordings/:id",

    requireLogin,

    (req, res) => {

        const recording =
            MediaRecording.findById(
                req.params.id
            );


        if (!recording) {

            return res.status(404).send(
                "Recording not found."
            );

        }


        if (
            !canAccessLessonRecording(
                req,
                recording
            )
        ) {

            return res.status(403).send(
                "You are not authorised to view this recording."
            );

        }


        return streamRecording(
            req,
            res,
            recording
        );

    }

);


// ========================================
// STUDENT EXERCISE RECORDING
// ========================================

router.get(

    "/media/student-recordings/:id",

    requireLogin,

    (req, res) => {

        const recording =
            StudentMediaRecording.findById(
                req.params.id
            );


        if (!recording) {

            return res.status(404).send(
                "Recording not found."
            );

        }


        const user =
            req.session.student;


        // ADMIN

        if (
            user.role === "admin"
        ) {

            return streamRecording(
                req,
                res,
                recording
            );

        }


        // STUDENT CAN ONLY VIEW OWN RECORDING

        if (
            user.role === "student" &&
            recording.student_id === user.id
        ) {

            return streamRecording(
                req,
                res,
                recording
            );

        }


        // TEACHER CAN VIEW RECORDINGS
        // FROM THEIR OWN COURSE

        if (
            user.role === "teacher"
        ) {

            const exercise =
                db.prepare(`

                    SELECT
                        exercises.lesson_id

                    FROM exercises

                    WHERE exercises.id = ?

                `).get(
                    recording.exercise_id
                );


            if (!exercise) {

                return res.status(404).send(
                    "Exercise not found."
                );

            }


            const course =
                db.prepare(`

                    SELECT
                        courses.teacher_id

                    FROM lessons

                    JOIN courses
                        ON courses.id =
                           lessons.course_id

                    WHERE lessons.id = ?

                `).get(
                    exercise.lesson_id
                );


            if (
                course &&
                course.teacher_id === user.id
            ) {

                return streamRecording(
                    req,
                    res,
                    recording
                );

            }

        }


        return res.status(403).send(
            "You are not authorised to view this recording."
        );

    }

);


module.exports =
    router;
