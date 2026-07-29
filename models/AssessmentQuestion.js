const db =
    require("../database/database");


// ========================================
// CREATE QUESTION
// ========================================

function createQuestion(
    assessmentId,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    marks
) {

    return db.prepare(`

        INSERT INTO assessment_questions
        (
            assessment_id,
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            marks
        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?)

    `).run(

        assessmentId,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        marks

    );

}


// ========================================
// FIND QUESTIONS BY ASSESSMENT
// ========================================

function findByAssessment(
    assessmentId
) {

    return db.prepare(`

        SELECT *

        FROM assessment_questions

        WHERE assessment_id = ?

        ORDER BY id ASC

    `).all(

        assessmentId

    );

}


// ========================================
// FIND QUESTION BY ID
// ========================================

function findById(id) {

    return db.prepare(`

        SELECT *

        FROM assessment_questions

        WHERE id = ?

    `).get(id);

}
// ========================================
// TOTAL MARKS
// ========================================

function totalMarks(assessmentId) {

    return db.prepare(`

        SELECT
            SUM(marks) AS total

        FROM assessment_questions

        WHERE assessment_id = ?

    `).get(assessmentId);

}


module.exports = {

    createQuestion,

    findByAssessment,

    findById,

    totalMarks

};