const db =
    require("../database/database");


// ========================================
// CREATE CLASSROOM SESSION
// ========================================

function createSession(
    courseId,
    teacherId
) {

    return db.prepare(`

        INSERT INTO classroom_sessions
        (
            course_id,
            teacher_id
        )

        VALUES (?, ?)

    `).run(
        courseId,
        teacherId
    );

}


// ========================================
// FIND SESSION BY ID
// ========================================

function findById(id) {

    return db.prepare(`

        SELECT *

        FROM classroom_sessions

        WHERE id = ?

    `).get(id);

}


// ========================================
// FIND ACTIVE SESSION BY COURSE
// ========================================

function findActiveByCourse(courseId) {

    return db.prepare(`

        SELECT *

        FROM classroom_sessions

        WHERE course_id = ?

        AND status = 'active'

        ORDER BY created_at DESC

        LIMIT 1

    `).get(courseId);

}


// ========================================
// FIND SESSIONS BY TEACHER
// ========================================

function findByTeacher(teacherId) {

    return db.prepare(`

        SELECT *

        FROM classroom_sessions

        WHERE teacher_id = ?

        ORDER BY created_at DESC

    `).all(teacherId);

}


// ========================================
// END CLASSROOM SESSION
// ========================================

function endSession(id) {

    return db.prepare(`

        UPDATE classroom_sessions

        SET

            status = 'ended',

            ended_at = CURRENT_TIMESTAMP

        WHERE id = ?

    `).run(id);

}


module.exports = {

    createSession,

    findById,

    findActiveByCourse,

    findByTeacher,

    endSession

};
