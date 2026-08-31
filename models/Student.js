const db = require("../database/database");


// ========================================
// FIND STUDENT BY EMAIL
// ========================================

function findByEmail(email) {

    return db.prepare(`
        SELECT *
        FROM students
        WHERE email = ?
    `).get(email);

}


// ========================================
// FIND STUDENT BY ID
// ========================================

function findById(id) {

    return db.prepare(`
        SELECT
            id,
            first_name,
            last_name,
            email,
            grade,
            role,
            created_at
        FROM students
        WHERE id = ?
    `).get(id);

}


// ========================================
// CREATE STUDENT
// ========================================

function createStudent(
    firstName,
    lastName,
    email,
    password,
    grade
) {

    return db.prepare(`
        INSERT INTO students
        (
            first_name,
            last_name,
            email,
            password,
            grade,
            role
        )
        VALUES (?, ?, ?, ?, ?, 'student')
    `).run(
        firstName,
        lastName,
        email,
        password,
        grade
    );

}
// ========================================
// GET ALL USERS
// ========================================

function findAll() {

    return db.prepare(`
        SELECT
            id,
            first_name,
            last_name,
            email,
            grade,
            role,
            created_at
        FROM students
        ORDER BY created_at DESC
    `).all();

}
// ========================================
// GET ALL STUDENTS ONLY
// ========================================

function findAllStudents() {

    return db.prepare(`
        SELECT
            id,
            first_name,
            last_name,
            email,
            grade,
            role,
            created_at
        FROM students
        WHERE role = 'student'
        ORDER BY created_at DESC
    `).all();

}

// ========================================
// GET ALL TEACHERS ONLY
// ========================================

function findAllTeachers() {

    return db.prepare(`
        SELECT
            id,
            first_name,
            last_name,
            email,
            grade,
            role,
            created_at
        FROM students
        WHERE role = 'teacher'
        ORDER BY created_at DESC
    `).all();

}


// ========================================
// CREATE TEACHER
// ========================================

function createTeacher(
    firstName,
    lastName,
    email,
    password
) {

    return db.prepare(`
        INSERT INTO students
        (
            first_name,
            last_name,
            email,
            password,
            grade,
            role
        )
        VALUES (?, ?, ?, ?, ?, 'teacher')
    `).run(
        firstName,
        lastName,
        email,
        password,
        "Teacher"
    );

}
// ========================================
// RECENT USERS
// ========================================

function getRecentUsers() {

    return db.prepare(`
        SELECT
            first_name,
            last_name,
            email,
            role,
            created_at
        FROM students
        ORDER BY created_at DESC
        LIMIT 5
    `).all();

}
// ========================================
// UPDATE USER
// ========================================

function updateUser(
    id,
    firstName,
    lastName,
    email,
    role
) {

    return db.prepare(`
        UPDATE students
        SET
            first_name = ?,
            last_name = ?,
            email = ?,
            role = ?
        WHERE id = ?
    `).run(
        firstName,
        lastName,
        email,
        role,
        id
    );

}


// ========================================
// UPDATE USER PASSWORD
// ========================================

function updatePassword(
    id,
    hashedPassword
) {

    return db.prepare(`
        UPDATE students
        SET password = ?
        WHERE id = ?
    `).run(
        hashedPassword,
        id
    );

}

// ========================================
// USER STATISTICS
// ========================================

function getStatistics() {

    const total =
        db.prepare(`
            SELECT COUNT(*) AS count
            FROM students
        `).get().count;


    const students =
        db.prepare(`
            SELECT COUNT(*) AS count
            FROM students
            WHERE role = 'student'
        `).get().count;


    const teachers =
        db.prepare(`
            SELECT COUNT(*) AS count
            FROM students
            WHERE role = 'teacher'
        `).get().count;


    const admins =
        db.prepare(`
            SELECT COUNT(*) AS count
            FROM students
            WHERE role = 'admin'
        `).get().count;


    return {
        total,
        students,
        teachers,
        admins
    };

}


// ========================================
// DELETE USER
// ========================================

function deleteUser(id) {

    return db.prepare(`
        DELETE FROM students
        WHERE id = ?
    `).run(id);

}
// ========================================
// EDIT STUDENT FORM
// ========================================

exports.editStudentForm = (req, res) => {


    const student =
        Student.findById(
            req.params.id
        );


    if (!student) {

        return res.redirect(
            "/admin/students"
        );

    }


    res.render(
        "edit-student",
        {
            user:
                req.session.student,

            student,

            error: null,

            success: null
        }
    );

};



// ========================================
// UPDATE STUDENT
// ========================================

function updateStudent(
    id,
    firstName,
    lastName,
    email,
    grade
) {

    return db.prepare(`
        UPDATE students
        SET
            first_name = ?,
            last_name = ?,
            email = ?,
            grade = ?
        WHERE id = ?
    `).run(
        firstName,
        lastName,
        email,
        grade,
        id
    );



    }





// ========================================
// DELETE STUDENT
// ========================================

exports.deleteStudent = (req, res) => {


    const student =
        Student.findById(
            req.params.id
        );


    if (!student) {

        return res.redirect(
            "/admin/students"
        );

    }


    Student.deleteUser(
        req.params.id
    );


    res.redirect(
        "/admin/students"
    );

};


module.exports = {
    findByEmail,
    findById,
    createStudent,
    findAll,
    findAllStudents,
    createTeacher,
    getStatistics,
    getRecentUsers,
    updateUser,
    updatePassword,
    updateStudent,
    deleteUser,
    findAllTeachers
};
   