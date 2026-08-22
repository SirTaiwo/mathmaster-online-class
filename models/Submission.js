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
// STUDENT EXERCISE HISTORY
// ========================================

function getStudentExerciseHistory(studentId) {

    return db.prepare(`

        SELECT

            submissions.id,

            submissions.answer,

            submissions.correct,

            submissions.marks,

            submissions.created_at,

            exercises.question,

            exercises.marks AS possible_marks

        FROM submissions

        JOIN exercises

        ON submissions.exercise_id =
           exercises.id

        WHERE submissions.student_id = ?

        ORDER BY submissions.created_at DESC

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
// STUDENT EXERCISE PERFORMANCE SUMMARY
// ========================================

function getStudentExercisePerformance(studentId) {

    return db.prepare(`

        SELECT

            COUNT(*) AS attempted,

            SUM(submissions.correct)
                AS correct_answers,

            SUM(
                CASE
                    WHEN submissions.correct = 0 THEN 1
                    ELSE 0
                END
            ) AS incorrect_answers,

            SUM(submissions.marks)
                AS total_marks,

            SUM(exercises.marks)
                AS total_possible_marks

        FROM submissions

        JOIN exercises

        ON submissions.exercise_id =
           exercises.id

        WHERE submissions.student_id = ?

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

            students.id AS student_id,

            students.first_name,

            students.last_name,

            COUNT(submissions.id)
            AS attempts,

            COALESCE(
                SUM(submissions.correct),
                0
            )
            AS correct,

            COALESCE(
                SUM(
                    CASE
                        WHEN submissions.id IS NOT NULL
                        THEN 1 - submissions.correct
                        ELSE 0
                    END
                ),
                0
            )
            AS incorrect,

            COALESCE(
                SUM(submissions.marks),
                0
            )
            AS marks,

            COALESCE(
                SUM(submissions.possible_marks),
                0
            )
            AS total_possible_marks


        FROM enrollments


        JOIN students

        ON enrollments.student_id =
           students.id


        LEFT JOIN (

            SELECT

                submissions.id,

                submissions.student_id,

                submissions.correct,

                submissions.marks,

                exercises.marks AS possible_marks

            FROM submissions

            JOIN exercises

            ON submissions.exercise_id =
               exercises.id

            JOIN lessons

            ON exercises.lesson_id =
               lessons.id

            WHERE lessons.course_id = ?

        ) AS submissions

        ON submissions.student_id =
           students.id


        WHERE enrollments.course_id = ?


        GROUP BY

            students.id,

            students.first_name,

            students.last_name


        ORDER BY

            students.last_name,

            students.first_name

    `).all(

        courseId,

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

// ========================================
// TEACHER GRADEBOOK SUMMARY
// ========================================

function getGradebookSummary() {

    return db.prepare(`

        SELECT

            COUNT(*) AS total_attempts,

            SUM(correct) AS correct_answers,

            SUM(
                CASE
                    WHEN correct = 0 THEN 1
                    ELSE 0
                END
            ) AS incorrect_answers,

            SUM(submissions.marks) AS total_marks,

            SUM(exercises.marks) AS total_possible_marks

        FROM submissions

        JOIN exercises

        ON submissions.exercise_id =
           exercises.id

    `).get();

}

// ========================================
// STUDENT GRADEBOOK SUMMARY
// ========================================

function getStudentGradebookSummary() {

    return db.prepare(`

        SELECT

            students.id AS student_id,

            students.first_name,

            students.last_name,

            COUNT(submissions.id) AS total_attempts,

            SUM(submissions.correct) AS correct_answers,

            SUM(
                CASE
                    WHEN submissions.correct = 0 THEN 1
                    ELSE 0
                END
            ) AS incorrect_answers,

            SUM(submissions.marks) AS total_marks,

            SUM(exercises.marks) AS total_possible_marks

        FROM submissions

        JOIN students

        ON submissions.student_id =
           students.id

        JOIN exercises

        ON submissions.exercise_id =
           exercises.id

        GROUP BY students.id

        ORDER BY students.first_name,
                 students.last_name

    `).all();

}

// ========================================
// TEACHER-SPECIFIC GRADEBOOK
// ========================================

function findAllByTeacher(teacherId) {

    return db.prepare(`SELECT
            submissions.*,
            students.first_name,
            students.last_name,
            exercises.question
        FROM submissions
        JOIN students
            ON submissions.student_id = students.id
        JOIN exercises
            ON submissions.exercise_id = exercises.id
        JOIN lessons
            ON exercises.lesson_id = lessons.id
        JOIN courses
            ON lessons.course_id = courses.id
        WHERE courses.teacher_id = ?
        ORDER BY submissions.created_at DESC
    `).all(teacherId);

}


function getGradebookSummaryByTeacher(teacherId) {

    return db.prepare(`SELECT
            COUNT(*) AS total_attempts,
            SUM(submissions.correct) AS correct_answers,
            SUM(
                CASE
                    WHEN submissions.correct = 0 THEN 1
                    ELSE 0
                END
            ) AS incorrect_answers,
            SUM(submissions.marks) AS total_marks,
            SUM(exercises.marks) AS total_possible_marks
        FROM submissions
        JOIN exercises
            ON submissions.exercise_id = exercises.id
        JOIN lessons
            ON exercises.lesson_id = lessons.id
        JOIN courses
            ON lessons.course_id = courses.id
        WHERE courses.teacher_id = ?
    `).get(teacherId);

}


function getStudentGradebookSummaryByTeacher(teacherId) {

    return db.prepare(`SELECT
            students.id AS student_id,
            students.first_name,
            students.last_name,
            COUNT(submissions.id) AS total_attempts,
            SUM(submissions.correct) AS correct_answers,
            SUM(
                CASE
                    WHEN submissions.correct = 0 THEN 1
                    ELSE 0
                END
            ) AS incorrect_answers,
            SUM(submissions.marks) AS total_marks,
            SUM(exercises.marks) AS total_possible_marks
        FROM submissions
        JOIN students
            ON submissions.student_id = students.id
        JOIN exercises
            ON submissions.exercise_id = exercises.id
        JOIN lessons
            ON exercises.lesson_id = lessons.id
        JOIN courses
            ON lessons.course_id = courses.id
        WHERE courses.teacher_id = ?
        GROUP BY students.id
        ORDER BY students.first_name,
                 students.last_name
    `).all(teacherId);

}


module.exports = {

    createSubmission,

    findByStudent,

    getStudentExerciseHistory,

    findByStudentAndExercise,

    getStudentSummary,

    getStudentExercisePerformance,

    findCoursePerformance,

    findAll,

    getGradebookSummary,

    getStudentGradebookSummary,

    findAllByTeacher,

    getGradebookSummaryByTeacher,

    getStudentGradebookSummaryByTeacher

};
