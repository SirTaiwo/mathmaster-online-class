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
// FIND SUBMISSIONS BY STUDENT AND EXERCISE
// ========================================

function findByStudentAndExercise(
    studentId,
    exerciseId
) {

    return db.prepare(`

        SELECT *

        FROM submissions

        WHERE student_id = ?

        AND exercise_id = ?

        ORDER BY created_at DESC

    `).all(

        studentId,
        exerciseId

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
// ========================================
// COURSE PERFORMANCE SUMMARY
// ========================================

function findCoursePerformance(courseId) {


    return db.prepare(`

        SELECT

            students.first_name,
            students.last_name,

            COUNT(submissions.id)
            AS attempts,


            SUM(submissions.correct)
            AS correct,


            SUM(submissions.marks)
            AS marks



        FROM submissions


        JOIN students

        ON submissions.student_id =
           students.id


        JOIN exercises

        ON submissions.exercise_id =
           exercises.id


        JOIN lessons

        ON exercises.lesson_id =
           lessons.id


        WHERE lessons.course_id = ?


        GROUP BY students.id


    `).all(

        courseId

    );


}




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
module.exports = {

    createSubmission,

    findByStudent,

    findByStudentAndExercise,

    getStudentSummary,

    findCoursePerformance,

    findAll

};
