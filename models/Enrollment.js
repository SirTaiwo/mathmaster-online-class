const db =
    require("../database/database");


// ========================================
// ENROLL STUDENT
// ========================================

function enrollStudent(
    studentId,
    courseId
) {

    const existing =
        db.prepare(`

            SELECT *

            FROM enrollments

            WHERE student_id = ?

            AND course_id = ?

        `).get(
            studentId,
            courseId
        );


    if (existing) {

        return false;

    }


    return db.prepare(`

        INSERT INTO enrollments
        (
            student_id,
            course_id
        )

        VALUES (?, ?)

    `).run(
        studentId,
        courseId
    );

}



// ========================================
// FIND STUDENTS BY COURSE
// ========================================

function findStudentsByCourse(
    courseId
) {

    return db.prepare(`

        SELECT

            students.id,
            students.first_name,
            students.last_name,
            students.email

        FROM enrollments

        JOIN students

        ON enrollments.student_id =
           students.id

        WHERE enrollments.course_id = ?

    `).all(
        courseId
    );

}



// ========================================
// FIND COURSES BY STUDENT
// ========================================

function findCoursesByStudent(
    studentId
) {

    return db.prepare(`

        SELECT

            courses.*

        FROM enrollments

        JOIN courses

        ON enrollments.course_id =
           courses.id

        WHERE enrollments.student_id = ?

    `).all(
        studentId
    );

}

// ========================================
// CHECK STUDENT ENROLLMENT
// ========================================

function isStudentEnrolled(
    studentId,
    courseId
) {

    return db.prepare(`

        SELECT 1

        FROM enrollments

        WHERE student_id = ?

        AND course_id = ?

    `).get(
        studentId,
        courseId
    );

}



// ========================================
// COUNT STUDENTS BY COURSE
// ========================================

function countStudentsByCourse(
    courseId
) {

    return db.prepare(`

        SELECT COUNT(*) AS total

        FROM enrollments

        WHERE course_id = ?

    `).get(
        courseId
    );

}
// ========================================
// FIND STUDENTS BY TEACHER
// ========================================

function findStudentsByTeacher(
    teacherId
) {

    return db.prepare(`

        SELECT DISTINCT

            students.id,
            students.first_name,
            students.last_name,
            students.email

        FROM enrollments

        JOIN students

        ON enrollments.student_id =
           students.id

        JOIN courses

        ON enrollments.course_id =
           courses.id

        WHERE courses.teacher_id = ?

    `).all(
        teacherId
    );

}


module.exports = {

    enrollStudent,

    findStudentsByCourse,

    findCoursesByStudent,

    isStudentEnrolled,

    countStudentsByCourse,

    findStudentsByTeacher

};