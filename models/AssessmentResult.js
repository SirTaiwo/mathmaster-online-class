const db =
    require("../database/database");


// ========================================
// SAVE RESULT
// ========================================

function saveResult(

    studentId,

    assessmentId,

    score,

    totalMarks,

    percentage

) {

    return db.prepare(`

        INSERT INTO assessment_results
        (
            student_id,
            assessment_id,
            score,
            total_marks,
            percentage
        )

        VALUES (?, ?, ?, ?, ?)

    `).run(

        studentId,
        assessmentId,
        score,
        totalMarks,
        percentage

    );

}



// ========================================
// FIND RESULTS BY STUDENT
// ========================================

function findByStudent(studentId) {

    return db.prepare(`

        SELECT *

        FROM assessment_results

        WHERE student_id = ?

        ORDER BY submitted_at DESC

    `).all(studentId);

}



// ========================================
// FIND RESULT
// ========================================

function findByAssessment(

    studentId,

    assessmentId

) {

    return db.prepare(`

        SELECT *

        FROM assessment_results

        WHERE student_id = ?

        AND assessment_id = ?

    `).get(

        studentId,

        assessmentId

    );

}



module.exports = {

    saveResult,

    findByStudent,

    findByAssessment

};