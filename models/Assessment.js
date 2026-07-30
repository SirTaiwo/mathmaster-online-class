const db =
    require("../database/database");


// ========================================
// CREATE ASSESSMENT
// ========================================

function createAssessment(
    lessonId,
    title,
    description,
    totalMarks,
    maxAttempts
) {

    return db.prepare(`

       INSERT INTO assessments
(
    lesson_id,
    title,
    description,
    total_marks,
    max_attempts
)

VALUES (?, ?, ?, ?, ?)

    `).run(

        lessonId,

        title,

        description,

        totalMarks,
        maxAttempts

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
// UPDATE ASSESSMENT
// ========================================

function updateAssessment(
    id,
    title,
    description,
    totalMarks,
    maxAttempts
) {

    return db.prepare(`

        UPDATE assessments

        SET

            title = ?,

            description = ?,

            total_marks = ?

        WHERE id = ?

    `).run(

        title,

        description,

        totalMarks,

        id

    );

}


// ========================================
// DELETE ASSESSMENT
// ========================================

function deleteAssessment(id) {

    return db.prepare(`

        DELETE

        FROM assessments

        WHERE id = ?

    `).run(id);

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

    updateAssessment,

    deleteAssessment,

    findAll

};