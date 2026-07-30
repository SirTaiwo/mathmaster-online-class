const db =
    require("../database/database");


// ========================================
// FIND PARENT BY EMAIL
// ========================================

function findByEmail(email) {

    return db.prepare(`

        SELECT *

        FROM students

        WHERE email = ?

        AND role = 'parent'

    `).get(email);

}



// ========================================
// FIND CHILDREN OF PARENT
// ========================================

function findChildren(parentId) {


    return db.prepare(`

        SELECT

            students.id,

            students.first_name,

            students.last_name,

            students.grade,

            parent_students.relationship


        FROM parent_students


        JOIN students

        ON students.id =
           parent_students.student_id


        WHERE parent_students.parent_id = ?


    `).all(parentId);


}



module.exports = {

    findByEmail,

    findChildren

};