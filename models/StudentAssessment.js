const db =
    require("../database/database");


// ========================================
// FIND ASSESSMENTS AVAILABLE TO STUDENT
// ========================================

function findByStudent(studentId) {


    return db.prepare(`

        SELECT

            assessments.id,
            assessments.title,
            assessments.description,
            assessments.total_marks,

            lessons.title AS lesson_title,

            courses.title AS course_title


        FROM enrollments


        JOIN courses

        ON enrollments.course_id =
           courses.id


        JOIN lessons

        ON lessons.course_id =
           courses.id


        JOIN assessments

        ON assessments.lesson_id =
           lessons.id


        WHERE enrollments.student_id = ?


        ORDER BY assessments.created_at DESC


    `).all(

        studentId

    );

}



module.exports = {

    findByStudent

};