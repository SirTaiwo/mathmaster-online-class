const db =
    require("../database/database");


// ========================================
// SAVE STUDENT ANSWER
// ========================================

function createSubmission(
    studentId,
    exerciseId,
    answer,
    correct,
    marks
) {


    return db.prepare(`

        INSERT INTO submissions

        (
            student_id,
            exercise_id,
            answer,
            correct,
            marks
        )

        VALUES (?, ?, ?, ?, ?)

    `).run(

        studentId,
        exerciseId,
        answer,
        correct,
        marks

    );

}



// ========================================
// FIND STUDENT SUBMISSIONS
// ========================================

function findByStudent(
    studentId
) {


    return db.prepare(`

        SELECT *

        FROM submissions

        WHERE student_id = ?

        ORDER BY created_at DESC

    `).all(

        studentId

    );

}
// ========================================
// STUDENT PERFORMANCE SUMMARY
// ========================================

function getStudentSummary(studentId) {


    return db.prepare(`

        SELECT

            COUNT(*) AS attempted,

            SUM(correct) AS correct_answers,

            SUM(marks) AS total_marks

        FROM submissions

        WHERE student_id = ?

    `).get(

        studentId

    );


}



module.exports = {

    createSubmission,

    findByStudent,   
    getStudentSummary,
    findAll

};
// ========================================
// FIND ALL SUBMISSIONS
// ========================================

function findAll() {


    return db.prepare(`

        SELECT

            submissions.*,

            students.first_name,
            students.last_name,

            exercises.question

        FROM submissions


        JOIN students

        ON submissions.student_id =
           students.id


        JOIN exercises

        ON submissions.exercise_id =
           exercises.id


        ORDER BY submissions.created_at DESC


    `).all();


}