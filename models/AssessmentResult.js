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

function findStudentAssessmentResult(

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
// FIND ALL RESULTS BY ASSESSMENT
// ========================================

function findByAssessment(assessmentId) {

    return db.prepare(`

        SELECT

            assessment_results.*,

            students.first_name,

            students.last_name,

            students.email


        FROM assessment_results


        JOIN students

        ON assessment_results.student_id =
           students.id


        WHERE assessment_results.assessment_id = ?


        ORDER BY 
    assessment_results.percentage DESC,
    assessment_results.submitted_at DESC


    `).all(

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
// ========================================
// STUDENT LEADERBOARD
// ========================================

function leaderboard() {

    return db.prepare(`

        SELECT

            students.id,

            students.first_name,

            students.last_name,

            COUNT(assessment_results.id)
                AS attempts,

            ROUND(

                AVG(
                    assessment_results.percentage
                ),

                0

            ) AS average_score

        FROM assessment_results

        JOIN students

        ON assessment_results.student_id =
           students.id

        GROUP BY students.id

        ORDER BY average_score DESC,
                 attempts DESC

    `).all();

}

// ========================================
// DELETE RESULTS FOR ASSESSMENT
// ========================================

function deleteByAssessment(assessmentId) {

    return db.prepare(`

        DELETE

        FROM assessment_results

        WHERE assessment_id = ?

    `).run(

        assessmentId

    );

}

// ========================================
// COUNT STUDENT ATTEMPTS
// ========================================

function countAttempts(studentId, assessmentId) {

    return db.prepare(`

        SELECT COUNT(*) AS attempts

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

    findStudentAssessmentResult,

    findByAssessment,

    getStudentPerformance,

    leaderboard,

    deleteByAssessment,

    countAttempts

};