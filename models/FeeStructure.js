const db =
    require("../database/database");

// ========================================
// ALL FEE STRUCTURES
// ========================================

function findAll() {

    return db.prepare(`

        SELECT *

        FROM fee_structures

        ORDER BY grade

    `).all();

}

// ========================================
// FIND ONE
// ========================================

function findById(id) {

    return db.prepare(`

        SELECT *

        FROM fee_structures

        WHERE id = ?

    `).get(id);

}

// ========================================
// CREATE
// ========================================

function create(

    grade,

    amount,

    description

) {

    return db.prepare(`

        INSERT INTO fee_structures
        (
            grade,
            amount,
            description
        )

        VALUES (?, ?, ?)

    `).run(

        grade,

        amount,

        description

    );

}

// ========================================
// UPDATE
// ========================================

function update(

    id,

    grade,

    amount,

    description

) {

    return db.prepare(`

        UPDATE fee_structures

        SET

            grade = ?,

            amount = ?,

            description = ?

        WHERE id = ?

    `).run(

        grade,

        amount,

        description,

        id

    );

}

// ========================================
// DELETE
// ========================================

function remove(id) {

    return db.prepare(`

        DELETE

        FROM fee_structures

        WHERE id = ?

    `).run(id);

}

module.exports = {

    findAll,

    findById,

    create,

    update,

    remove

};