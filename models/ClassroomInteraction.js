const db =
    require("../database/database");

// CREATE CLASSROOM INTERACTION
function createInteraction(
    sessionId,
    studentId,
    interactionType
) {
    return db.prepare(`
        INSERT INTO classroom_interactions
        (
            session_id,
            student_id,
            interaction_type
        )
        VALUES (?, ?, ?)
    `).run(
        sessionId,
        studentId,
        interactionType
    );
}

// FIND INTERACTIONS BY SESSION
function findBySession(sessionId) {
    return db.prepare(`
        SELECT
            classroom_interactions.*,
            students.first_name,
            students.last_name
        FROM classroom_interactions
        JOIN students
        ON students.id =
           classroom_interactions.student_id
        WHERE classroom_interactions.session_id = ?
        ORDER BY classroom_interactions.created_at ASC
    `).all(sessionId);
}

// FIND INTERACTIONS BY STUDENT AND SESSION
function findByStudentAndSession(
    studentId,
    sessionId
) {
    return db.prepare(`
        SELECT
            classroom_interactions.*
        FROM classroom_interactions
        WHERE student_id = ?
        AND session_id = ?
        ORDER BY created_at DESC
    `).all(
        studentId,
        sessionId
    );
}


function findById(
    interactionId
) {

    return db.prepare(`
        SELECT
            classroom_interactions.*,
            students.first_name,
            students.last_name
        FROM classroom_interactions
        JOIN students
        ON students.id =
           classroom_interactions.student_id
        WHERE classroom_interactions.id = ?
    `).get(
        interactionId
    );

}

// ACKNOWLEDGE CLASSROOM INTERACTION
function acknowledgeInteraction(
    interactionId
) {

    return db.prepare(`
        UPDATE classroom_interactions

        SET
            acknowledged_at = CURRENT_TIMESTAMP

        WHERE id = ?

    `).run(
        interactionId
    );

}

module.exports = {
    createInteraction,
    findBySession,
    findByStudentAndSession,
    findById,
    acknowledgeInteraction
};
