const Payment =
    require("../models/Payment");


const Invoice =
    require("../models/Invoice");

    const Receipt = require("../models/Receipt");


// ========================================
// VIEW PAYMENTS
// ========================================

exports.index = (req, res) => {


    const payments =
        Payment.findAll();


    res.render(
        "admin-payments",
        {
            payments
        }
    );

};



// ========================================
// ADD PAYMENT
// ========================================

exports.create = (req, res) => {


    const {

        invoice_id,

        student_id,

        amount_paid,

        payment_method,

        reference_number


    } = req.body;

    console.log("PAYMENT DATA:", req.body);



 const paymentResult = Payment.createPayment(
    invoice_id,
    student_id,
    amount_paid,
    payment_method,
    reference_number
);

Invoice.updatePaymentStatus(invoice_id);

// Generate receipt number
const receiptNumber =
    "REC-" +
    String(paymentResult.lastInsertRowid).padStart(6, "0");

Receipt.createReceipt(
    receiptNumber,
    paymentResult.lastInsertRowid,
    student_id,
    amount_paid
);

res.redirect("/admin/payments");

};