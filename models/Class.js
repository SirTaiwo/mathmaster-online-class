const db = require("../database/database");


// ========================================
// CREATE CLASS
// ========================================

function createClass(
    className,
    grade,
    teacherId
) {

    return db.prepare(`
        INSERT INTO classes
        (
            class_name,
            grade,
            teacher_id
        )
        VALUES (?, ?, ?)
    `).run(
        className,
        grade,
        teacherId
    );

}


// ========================================
// GET ALL CLASSES
// ========================================

function findAll() {

    return db.prepare(`
        SELECT
            classes.*,
            students.first_name,
            students.last_name
        FROM classes

        LEFT JOIN students
        ON classes.teacher_id = students.id

        ORDER BY classes.created_at DESC

    `).all();

}


// ========================================
// FIND CLASS BY ID
// ========================================

function findById(id) {

    return db.prepare(`
        SELECT *
        FROM classes
        WHERE id = ?
    `).get(id);

}


// ========================================
// ADD STUDENT TO CLASS
// ========================================

function addStudent(
    classId,
    studentId
) {

    return db.prepare(`
        INSERT INTO class_students
        (
            class_id,
            student_id
        )
        VALUES (?, ?)
    `).run(
        classId,
        studentId
    );

}


// ========================================
// GET CLASS STUDENTS
// ========================================

function getClassStudents(classId) {

    return db.prepare(`
        SELECT
            students.*
        FROM class_students

        JOIN students
        ON class_students.student_id = students.id

        WHERE class_students.class_id = ?

    `).all(classId);

}


// ========================================
// DELETE CLASS
// ========================================

function deleteClass(id) {

    return db.prepare(`
        DELETE FROM classes
        WHERE id = ?
    `).run(id);

}

// ========================================
// GET AVAILABLE STUDENTS
// ========================================

function getAvailableStudents() {

    return db.prepare(`
        SELECT *
        FROM students
        WHERE role = 'student'
        ORDER BY first_name ASC
    `).all();

}


// ========================================
// REMOVE STUDENT FROM CLASS
// ========================================

function removeStudent(
    classId,
    studentId
) {

    return db.prepare(`
        DELETE FROM class_students
        WHERE class_id = ?
        AND student_id = ?
    `).run(
        classId,
        studentId
    );

}


module.exports = {

    createClass,
    findAll,
    findById,
    addStudent,
    getClassStudents,
    deleteClass,
    getAvailableStudents,
    removeStudent

};