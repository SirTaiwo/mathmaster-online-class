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
// DATABASE MIGRATION
// ADD MAX ATTEMPTS TO ASSESSMENTS
// ========================================

const assessmentColumns = db.prepare(`
    PRAGMA table_info(assessments)
`).all();


const hasMaxAttempts =
    assessmentColumns.some(
        column => column.name === "max_attempts"
    );


if (!hasMaxAttempts) {

    db.prepare(`
        ALTER TABLE assessments
        ADD COLUMN max_attempts INTEGER DEFAULT 1
    `).run();


    console.log(
        "Database updated: max_attempts column added."
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

// ========================================
// CREATE STUDENT FEEDBACK TABLE
// ========================================

db.prepare(`

    CREATE TABLE IF NOT EXISTS student_feedback (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        student_id INTEGER NOT NULL,

        teacher_id INTEGER NOT NULL,

        feedback TEXT NOT NULL,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(student_id)
            REFERENCES students(id),

        FOREIGN KEY(teacher_id)
            REFERENCES students(id)

    )

`).run();

// ========================================
// CREATE PARENT-STUDENT RELATIONSHIP TABLE
// ========================================

db.prepare(`

    CREATE TABLE IF NOT EXISTS parent_students (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        parent_id INTEGER NOT NULL,

        student_id INTEGER NOT NULL,

        relationship TEXT,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,


        FOREIGN KEY(parent_id)
            REFERENCES students(id),


        FOREIGN KEY(student_id)
            REFERENCES students(id)

    )

`).run();

// ========================================
// CREATE FEE STRUCTURES TABLE
// ========================================

db.prepare(`

CREATE TABLE IF NOT EXISTS fee_structures (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    grade TEXT NOT NULL UNIQUE,

    amount REAL NOT NULL,

    description TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)

`).run();

// ========================================
// CREATE STUDENT FEES TABLE
// ========================================

db.prepare(`

CREATE TABLE IF NOT EXISTS student_fees (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    student_id INTEGER NOT NULL,

    fee_structure_id INTEGER NOT NULL,

    term TEXT NOT NULL,

    year INTEGER NOT NULL,

    amount_due REAL NOT NULL,

    amount_paid REAL DEFAULT 0,

    status TEXT DEFAULT 'Outstanding',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(student_id)
        REFERENCES students(id),

    FOREIGN KEY(fee_structure_id)
        REFERENCES fee_structures(id)

)

`).run();

// ========================================
// CREATE INVOICES TABLE
// ========================================

db.prepare(`

CREATE TABLE IF NOT EXISTS invoices (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    invoice_number TEXT NOT NULL UNIQUE,

    student_id INTEGER NOT NULL,

    student_fee_id INTEGER NOT NULL,

    description TEXT NOT NULL,

    amount REAL NOT NULL,

    amount_paid REAL DEFAULT 0,

    balance REAL NOT NULL,

    status TEXT DEFAULT 'Outstanding',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(student_id)
        REFERENCES students(id),


    FOREIGN KEY(student_fee_id)
        REFERENCES student_fees(id)

)

`).run();

// ========================================
// CREATE PAYMENTS TABLE
// ========================================

db.prepare(`

CREATE TABLE IF NOT EXISTS payments (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    invoice_id INTEGER NOT NULL,

    student_id INTEGER NOT NULL,

    amount_paid REAL NOT NULL,

    payment_method TEXT,

    reference_number TEXT,

    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(invoice_id)
        REFERENCES invoices(id),


    FOREIGN KEY(student_id)
        REFERENCES students(id)

)

`).run();

// ========================================
// CREATE RECEIPTS TABLE
// ========================================

db.prepare(`

CREATE TABLE IF NOT EXISTS receipts (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    receipt_number TEXT NOT NULL UNIQUE,

    payment_id INTEGER NOT NULL,

    student_id INTEGER NOT NULL,

    amount REAL NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(payment_id)
        REFERENCES payments(id),


    FOREIGN KEY(student_id)
        REFERENCES students(id)

)

`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS attendance (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    student_id INTEGER NOT NULL,

    course_id INTEGER,

    attendance_date DATE NOT NULL,

    status TEXT NOT NULL,

    remarks TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(student_id)
        REFERENCES students(id),

    FOREIGN KEY(course_id)
        REFERENCES courses(id)

)
`).run();

// ========================================
// ATTENDANCE DUPLICATE PROTECTION
// ========================================

db.prepare(`
CREATE UNIQUE INDEX IF NOT EXISTS
unique_student_attendance_date

ON attendance(
    student_id,
    attendance_date
)
`).run();

// ========================================
// CREATE CLASSES TABLE
// ========================================

db.prepare(`

CREATE TABLE IF NOT EXISTS classes (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    class_name TEXT NOT NULL,

    grade TEXT NOT NULL,

    teacher_id INTEGER,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(teacher_id)
        REFERENCES students(id)

)

`).run();



// ========================================
// CREATE CLASS STUDENTS TABLE
// ========================================

db.prepare(`

CREATE TABLE IF NOT EXISTS class_students (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    class_id INTEGER NOT NULL,

    student_id INTEGER NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(class_id)
        REFERENCES classes(id),


    FOREIGN KEY(student_id)
        REFERENCES students(id)

)

`).run();


// ========================================
// CREATE MEDIA RECORDINGS TABLE
// TEACHER LESSON AUDIO AND VIDEO
// ========================================

db.prepare(`
CREATE TABLE IF NOT EXISTS media_recordings (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    teacher_id INTEGER NOT NULL,

    lesson_id INTEGER NOT NULL,

    media_type TEXT NOT NULL,

    file_path TEXT NOT NULL,

    mime_type TEXT,

    duration INTEGER,

    file_size INTEGER,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(teacher_id)
        REFERENCES students(id),

    FOREIGN KEY(lesson_id)
        REFERENCES lessons(id)

)
`).run();



module.exports = db;