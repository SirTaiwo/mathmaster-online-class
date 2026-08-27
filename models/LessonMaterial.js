const db =
    require("../database/database");


// ========================================
// CREATE LESSON MATERIAL
// ========================================

function createMaterial(
    teacher_id,
    lesson_id,
    title,
    description,
    file_path,
    original_filename,
    mime_type,
    file_size
) {

    return db.prepare(`

        INSERT INTO lesson_materials
        (
            teacher_id,
            lesson_id,
            title,
            description,
            file_path,
            original_filename,
            mime_type,
            file_size
        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?)

    `).run(

        teacher_id,
        lesson_id,
        title,
        description,
        file_path,
        original_filename,
        mime_type,
        file_size

    );

}


// ========================================
// FIND MATERIAL BY ID
// ========================================

function findById(id) {

    return db.prepare(`

        SELECT *

        FROM lesson_materials

        WHERE id = ?

    `).get(id);

}


// ========================================
// FIND MATERIALS BY LESSON
// ========================================

function findByLesson(lesson_id) {

    return db.prepare(`

        SELECT *

        FROM lesson_materials

        WHERE lesson_id = ?

        ORDER BY created_at DESC

    `).all(lesson_id);

}


// ========================================
// FIND MATERIALS BY TEACHER
// ========================================

function findByTeacher(teacher_id) {

    return db.prepare(`

        SELECT *

        FROM lesson_materials

        WHERE teacher_id = ?

        ORDER BY created_at DESC

    `).all(teacher_id);

}


// ========================================
// FIND MATERIALS BY TEACHER AND LESSON
// ========================================

function findByTeacherAndLesson(
    teacher_id,
    lesson_id
) {

    return db.prepare(`

        SELECT *

        FROM lesson_materials

        WHERE teacher_id = ?

        AND lesson_id = ?

        ORDER BY created_at DESC

    `).all(
        teacher_id,
        lesson_id
    );

}


// ========================================
// DELETE MATERIAL
// ========================================

function deleteMaterial(id) {

    return db.prepare(`

        DELETE FROM lesson_materials

        WHERE id = ?

    `).run(id);

}


module.exports = {

    createMaterial,

    findById,

    findByLesson,

    findByTeacher,

    findByTeacherAndLesson,

    deleteMaterial

};
