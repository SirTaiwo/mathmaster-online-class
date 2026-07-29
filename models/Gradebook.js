const db =
    require("../database/database");

// ========================================
// ALL STUDENT RESULTS
// ========================================

function getAllResults() {

    return db.prepare(`

        SELECT

            assessment_results.id,

            students.first_name,

            students.last_name,

            courses.title AS course_title,

            assessments.title AS assessment_title,

            assessment_results.score,

            assessment_results.total_marks,

            assessment_results.percentage,

            assessment_results.submitted_at

        FROM assessment_results

        JOIN students

        ON students.id =
           assessment_results.student_id

        JOIN assessments

        ON assessments.id =
           assessment_results.assessment_id

        JOIN lessons

        ON lessons.id =
           assessments.lesson_id

        JOIN courses

        ON courses.id =
           lessons.course_id

        ORDER BY

        assessment_results.submitted_at DESC

    `).all();

}

module.exports = {

    getAllResults

};