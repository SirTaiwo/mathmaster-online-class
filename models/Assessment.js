const db =
    require("../database/database");


// ========================================
// CREATE ASSESSMENT
// ========================================

function createAssessment(
    lessonId,
    title,
    description,
    totalMarks
) {

    return db.prepare(`

        INSERT INTO assessments

        (
            lesson_id,
            title,
            description,
            total_marks
        )

        VALUES (?, ?, ?, ?)

    `).run(

        lessonId,
        title,
        description,
        totalMarks

    );

}



// ========================================
// FIND ASSESSMENTS BY LESSON
// ========================================

function findByLesson(
    lessonId
) {

    return db.prepare(`

        SELECT *

        FROM assessments

        WHERE lesson_id = ?

        ORDER BY created_at ASC

    `).all(

        lessonId

    );

}



// ========================================
// FIND ASSESSMENT BY ID
// ========================================

function findById(
    id
) {

    return db.prepare(`

        SELECT *

        FROM assessments

        WHERE id = ?

    `).get(

        id

    );

}



module.exports = {

    createAssessment,

    findByLesson,

    findById

};