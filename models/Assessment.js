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
// ========================================
// FIND ALL ASSESSMENTS
// ========================================

function findAll() {

    return db.prepare(`

        SELECT

            assessments.*,

            lessons.title AS lesson_title,

            courses.title AS course_title


        FROM assessments


        JOIN lessons

        ON lessons.id =
           assessments.lesson_id


        JOIN courses

        ON courses.id =
           lessons.course_id


        ORDER BY assessments.created_at DESC


    `).all();

}

module.exports = {

    createAssessment,

    findByLesson,

    findById,

    findAll

};