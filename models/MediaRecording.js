const db =
    require("../database/database");


// ========================================
// CREATE TEACHER LESSON RECORDING
// ========================================

function createRecording(
    teacher_id,
    lesson_id,
    media_type,
    file_path,
    mime_type,
    duration,
    file_size
) {

    return db.prepare(`

        INSERT INTO media_recordings
        (
            teacher_id,
            lesson_id,
            media_type,
            file_path,
            mime_type,
            duration,
            file_size
        )

        VALUES (?, ?, ?, ?, ?, ?, ?)

    `).run(

        teacher_id,
        lesson_id,
        media_type,
        file_path,
        mime_type,
        duration,
        file_size

    );

}


// ========================================
// FIND RECORDING BY ID
// ========================================

function findById(id) {

    return db.prepare(`

        SELECT

            media_recordings.*,

            students.first_name AS teacher_first_name,

            students.last_name AS teacher_last_name

        FROM media_recordings

        JOIN students

            ON media_recordings.teacher_id =
               students.id

        WHERE media_recordings.id = ?

    `).get(id);

}


// ========================================
// FIND RECORDINGS BY TEACHER
// ========================================

function findByTeacher(teacher_id) {

    return db.prepare(`

        SELECT *

        FROM media_recordings

        WHERE teacher_id = ?

        ORDER BY created_at DESC

    `).all(teacher_id);

}


// ========================================
// FIND RECORDINGS BY LESSON
// ========================================

function findByLesson(lesson_id) {

    return db.prepare(`

        SELECT

            media_recordings.*,

            students.first_name AS teacher_first_name,

            students.last_name AS teacher_last_name

        FROM media_recordings

        JOIN students

            ON media_recordings.teacher_id =
               students.id

        WHERE media_recordings.lesson_id = ?

        ORDER BY media_recordings.created_at DESC

    `).all(lesson_id);

}


// ========================================
// FIND RECORDINGS BY TEACHER AND LESSON
// ========================================

function findByTeacherAndLesson(
    teacher_id,
    lesson_id
) {

    return db.prepare(`

        SELECT *

        FROM media_recordings

        WHERE teacher_id = ?

        AND lesson_id = ?

        ORDER BY created_at DESC

    `).all(

        teacher_id,
        lesson_id

    );

}


// ========================================
// DELETE RECORDING
// ========================================

function deleteRecording(id) {

    return db.prepare(`

        DELETE FROM media_recordings

        WHERE id = ?

    `).run(id);

}


module.exports = {

    createRecording,

    findById,

    findByTeacher,

    findByLesson,

    findByTeacherAndLesson,

    deleteRecording

};
