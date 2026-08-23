const db =
    require("../database/database");


// ========================================
// CREATE MEDIA RECORDING
// ========================================

function createRecording(
    student_id,
    submission_id,
    media_type,
    file_path,
    mime_type,
    duration,
    file_size
) {

    return db.prepare(`

        INSERT INTO media_recordings
        (
            student_id,
            submission_id,
            media_type,
            file_path,
            mime_type,
            duration,
            file_size
        )

        VALUES (?, ?, ?, ?, ?, ?, ?)

    `).run(

        student_id,
        submission_id,
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

        FROM media_recordings

        WHERE id = ?

    `).get(id);

}


// ========================================
// FIND RECORDINGS BY STUDENT
// ========================================

function findByStudent(student_id) {

    return db.prepare(`

        SELECT *

        FROM media_recordings

        WHERE student_id = ?

        ORDER BY created_at DESC

    `).all(student_id);

}


// ========================================
// FIND RECORDINGS BY SUBMISSION
// ========================================

function findBySubmission(submission_id) {

    return db.prepare(`

        SELECT *

        FROM media_recordings

        WHERE submission_id = ?

        ORDER BY created_at DESC

    `).all(submission_id);

}


module.exports = {

    createRecording,

    findById,

    findByStudent,

    findBySubmission

};
