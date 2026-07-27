const db =
    require("../database/database");


// ========================================
// CREATE COURSE
// ========================================

function createCourse(
    teacherId,
    title,
    description,
    grade
) {

    return db.prepare(`
        INSERT INTO courses
        (
            teacher_id,
            title,
            description,
            grade
        )

        VALUES (?, ?, ?, ?)

    `).run(
        teacherId,
        title,
        description,
        grade
    );

}



// ========================================
// FIND COURSES BY TEACHER
// ========================================

function findByTeacher(
    teacherId
) {

    return db.prepare(`
        SELECT
            *
        FROM courses

        WHERE teacher_id = ?

        ORDER BY created_at DESC

    `).all(
        teacherId
    );

}



// ========================================
// FIND COURSE BY ID
// ========================================

function findById(
    id
) {

    return db.prepare(`
        SELECT
            *
        FROM courses

        WHERE id = ?

    `).get(
        id
    );

}



// ========================================
// DELETE COURSE
// ========================================

function deleteCourse(
    id
) {

    return db.prepare(`
        DELETE FROM courses

        WHERE id = ?

    `).run(
        id
    );

}
// ========================================
// FIND ALL COURSES
// ========================================

function findAllCourses() {

    return db.prepare(`

        SELECT

            courses.*,

            students.first_name,
            students.last_name

        FROM courses

        JOIN students

        ON courses.teacher_id = students.id

        ORDER BY courses.created_at DESC

    `).all();

}
// ========================================
// COUNT COURSES BY TEACHER
// ========================================

function countByTeacher(
    teacherId
) {

    return db.prepare(`

        SELECT COUNT(*) AS total

        FROM courses

        WHERE teacher_id = ?

    `).get(
        teacherId
    );

}

module.exports = {

    createCourse,

    findByTeacher,

    findById,

    deleteCourse,

    countByTeacher

};

