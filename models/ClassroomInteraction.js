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

module.exports = {
    createInteraction,
    findBySession
};
