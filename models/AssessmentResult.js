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

        SELECT

            assessment_results.*,

            assessments.title AS assessment_title


        FROM assessment_results


        JOIN assessments

        ON assessment_results.assessment_id =
           assessments.id


        WHERE assessment_results.student_id = ?


        ORDER BY submitted_at DESC


    `).all(

        studentId

    );


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
// ========================================
// STUDENT PERFORMANCE SUMMARY
// ========================================

function getStudentPerformance(studentId) {


    return db.prepare(`

        SELECT

            COUNT(*) AS attempts,

            ROUND(
                AVG(percentage),
                2
            ) AS average_percentage,


            MAX(percentage)
            AS highest_percentage,


            (
                SELECT percentage

                FROM assessment_results

                WHERE student_id = ?

                ORDER BY submitted_at DESC

                LIMIT 1

            ) AS latest_percentage


        FROM assessment_results


        WHERE student_id = ?


    `).get(

        studentId,

        studentId

    );


}



module.exports = {

    saveResult,

    findByStudent,

    findByAssessment,
    getStudentPerformance

};