const FeeStructure =
    require("../models/FeeStructure");

// ========================================
// FEE STRUCTURES
// ========================================

exports.index = (req, res) => {

    const fees =
        FeeStructure.findAll();

    res.render(

        "admin-fees",

        {

            user:
                req.session.student,

            fees

        }

    );

};

// ========================================
// CREATE FEE
// ========================================

exports.create = (req, res) => {

    const {

        grade,

        amount,

        description

    } = req.body;

    FeeStructure.create(

        grade,

        amount,

        description

    );

    res.redirect(
        "/admin/finance"
    );

};

// ========================================
// DELETE FEE
// ========================================

exports.delete = (req, res) => {

    FeeStructure.remove(

        req.params.id

    );

    res.redirect(
        "/admin/finance"
    );

};