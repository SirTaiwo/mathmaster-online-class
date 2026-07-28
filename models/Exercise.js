const db =
    require("../database/database");


// ========================================
// CREATE EXERCISE
// ========================================

function createExercise(
    lessonId,
    question,
    answer,
    marks
) {

    return db.prepare(`

        INSERT INTO exercises
        (
            lesson_id,
            question,
            answer,
            marks
        )

        VALUES (?, ?, ?, ?)

    `).run(
        lessonId,
        question,
        answer,
        marks
    );

}



// ========================================
// FIND EXERCISES BY LESSON
// ========================================

function findByLesson(
    lessonId
) {

    return db.prepare(`

        SELECT *
        FROM exercises

        WHERE lesson_id = ?

        ORDER BY created_at ASC

    `).all(
        lessonId
    );

}



// ========================================
// FIND EXERCISE BY ID
// ========================================

function findById(
    id
) {

    return db.prepare(`

        SELECT *
        FROM exercises

        WHERE id = ?

    `).get(
        id
    );

}



module.exports = {

    createExercise,

    findByLesson,

    findById

};