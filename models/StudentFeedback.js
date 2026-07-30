const db =
    require("../database/database");


// ========================================
// SAVE FEEDBACK
// ========================================

function createFeedback(

    studentId,

    teacherId,

    feedback

) {

    return db.prepare(`

        INSERT INTO student_feedback

        (

            student_id,

            teacher_id,

            feedback

        )

        VALUES (?, ?, ?)

    `).run(

        studentId,

        teacherId,

        feedback

    );

}


// ========================================
// GET STUDENT FEEDBACK
// ========================================

function findByStudent(studentId) {

    return db.prepare(`

        SELECT

            student_feedback.*,

            students.first_name AS teacher_first,

            students.last_name AS teacher_last


        FROM student_feedback


        JOIN students

        ON students.id =
           student_feedback.teacher_id


        WHERE student_feedback.student_id = ?


        ORDER BY created_at DESC


    `).all(studentId);

}


module.exports = {

    createFeedback,

    findByStudent

};