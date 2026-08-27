const db =
    require("../database/database");


// ========================================
// CREATE STUDENT EXERCISE RECORDING
// ========================================

function createRecording(
    student_id,
    exercise_id,
    media_type,
    file_path,
    mime_type,
    duration,
    file_size
) {

    return db.prepare(`

        INSERT INTO student_media_recordings
        (
            student_id,
            exercise_id,
            media_type,
            file_path,
            mime_type,
            duration,
            file_size
        )

        VALUES (?, ?, ?, ?, ?, ?, ?)

    `).run(

        student_id,
        exercise_id,
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

        SELECT *

        FROM student_media_recordings

        WHERE id = ?

    `).get(id);

}


// ========================================
// FIND RECORDINGS BY STUDENT
// ========================================

function findByStudent(student_id) {

    return db.prepare(`

        SELECT *

        FROM student_media_recordings

        WHERE student_id = ?

        ORDER BY created_at DESC

    `).all(student_id);

}


// ========================================
// FIND RECORDINGS BY EXERCISE
// ========================================

function findByExercise(exercise_id) {

    return db.prepare(`

        SELECT *

        FROM student_media_recordings

        WHERE exercise_id = ?

        ORDER BY created_at DESC

    `).all(exercise_id);

}


// ========================================
// FIND RECORDINGS BY STUDENT AND EXERCISE
// ========================================

function findByStudentAndExercise(
    student_id,
    exercise_id
) {

    return db.prepare(`

        SELECT *

        FROM student_media_recordings

        WHERE student_id = ?

        AND exercise_id = ?

        ORDER BY created_at DESC

    `).all(

        student_id,
        exercise_id

    );

}


// ========================================
// DELETE RECORDING
// ========================================

function deleteRecording(id) {

    return db.prepare(`

        DELETE FROM student_media_recordings

        WHERE id = ?

    `).run(id);

}


module.exports = {

    createRecording,

    findById,

    findByStudent,

    findByExercise,

    findByStudentAndExercise,

    deleteRecording

};