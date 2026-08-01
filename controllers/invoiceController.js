const Invoice =
    require("../models/Invoice");


// ========================================
// VIEW ALL INVOICES
// ========================================

exports.index = (req, res) => {

    const invoices =
        Invoice.findAll();


    res.render(
        "admin-invoices",
        {
            invoices
        }
    );

};