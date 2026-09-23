const db =
    require("../database/database");


// ========================================
// CREATE CLASSROOM MESSAGE
// ========================================

function createMessage(
    sessionId,
    studentId,
    message
) {

    return db.prepare(`

        INSERT INTO classroom_messages
        (
            session_id,
            student_id,
            message
        )

        VALUES (?, ?, ?)

    `).run(
        sessionId,
        studentId,
        message
    );

}


// ========================================
// FIND MESSAGES BY SESSION
// ========================================

function findBySession(sessionId) {

    return db.prepare(`

        SELECT
            classroom_messages.*,
            students.first_name,
            students.last_name

        FROM classroom_messages

        JOIN students
        ON students.id =
           classroom_messages.student_id

        WHERE classroom_messages.session_id = ?

        ORDER BY classroom_messages.created_at ASC

    `).all(sessionId);

}


module.exports = {

    createMessage,

    findBySession

};