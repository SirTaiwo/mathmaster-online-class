const Receipt = require("../models/Receipt");
const Payment = require("../models/Payment");


exports.index = (req, res) => {

    const receipts = Receipt.findAll();

    res.render(
        "admin-receipts",
        {
            receipts
        }
    );

};



exports.create = (req, res) => {

    const {
        receipt_number,
        payment_id,
        student_id,
        amount
    } = req.body;


    Receipt.createReceipt(
        receipt_number,
        payment_id,
        student_id,
        amount
    );


    res.redirect("/admin/receipts");

};



exports.view = (req, res) => {

    const receipt =
        Receipt.findById(req.params.id);


    res.render(
        "receipt-view",
        {
            receipt
        }
    );

};