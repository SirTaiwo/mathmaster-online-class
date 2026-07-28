const Database = require("better-sqlite3");

const db = new Database("database/mathclass.db");


// ========================================
// CREATE STUDENTS TABLE
// ========================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        grade TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();
// ========================================
// DATABASE MIGRATION
// ========================================

const columns = db.prepare(`
    PRAGMA table_info(students)
`).all();

const hasRoleColumn =
    columns.some(column => column.name === "role");


if (!hasRoleColumn) {

    db.prepare(`
        ALTER TABLE students
        ADD COLUMN role TEXT NOT NULL DEFAULT 'student'
    `).run();

    console.log(
        "Database updated: role column added."
    );

}
// ========================================
// CREATE COURSES TABLE
// ========================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS courses (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        teacher_id INTEGER NOT NULL,

        title TEXT NOT NULL,

        description TEXT,

        grade TEXT NOT NULL,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (teacher_id)
            REFERENCES students(id)
    )
`).run();
// ========================================
// CREATE LESSONS TABLE
// ========================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS lessons (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    course_id INTEGER NOT NULL,

    title TEXT NOT NULL,

    objectives TEXT,

    content TEXT,

    example TEXT,

    exercise TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (course_id)
        REFERENCES courses(id)

)
`).run();

// ========================================
// CREATE EXERCISES TABLE
// ========================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS exercises (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        lesson_id INTEGER NOT NULL,

        question TEXT NOT NULL,

        answer TEXT NOT NULL,

        marks INTEGER DEFAULT 1,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (lesson_id)
            REFERENCES lessons(id)

    )
`).run();
// ========================================
// CREATE ENROLLMENTS TABLE
// ========================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS enrollments (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        student_id INTEGER NOT NULL,

        course_id INTEGER NOT NULL,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(student_id)
            REFERENCES students(id),

        FOREIGN KEY(course_id)
            REFERENCES courses(id)

    )
`).run();


module.exports = db;