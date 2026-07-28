const db =
    require("../database/database");


// ========================================
// CREATE LESSON
// ========================================

function createLesson(
   courseId,
title,
objectives,
content,
example,
exercise
) {

    return db.prepare(`
        INSERT INTO lessons
        (
            course_id,
            title,
            objectives,
            content,
            example,
            exercise
        )

        VALUES (?, ?, ?, ?, ?, ?)

    `).run(
        courseId,
        title,
        objectives,
        content,
        example,
        exercise
    );

}



// ========================================
// FIND LESSONS BY COURSE
// ========================================

function findByCourse(
    courseId
) {

    return db.prepare(`
        SELECT
            *
        FROM lessons

        WHERE course_id = ?

        ORDER BY created_at ASC

    `).all(
        courseId
    );

}



// ========================================
// FIND LESSON BY ID
// ========================================

function findById(
    id
) {

    return db.prepare(`
        SELECT
            *
        FROM lessons

        WHERE id = ?

    `).get(
        id
    );

}



// ========================================
// DELETE LESSON
// ========================================

function deleteLesson(
    id
) {

    return db.prepare(`
        DELETE FROM lessons

        WHERE id = ?

    `).run(
        id
    );

}



module.exports = {

    createLesson,

    findByCourse,

    findById,

    deleteLesson

};