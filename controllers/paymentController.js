const Payment =
    require("../models/Payment");


const Invoice =
    require("../models/Invoice");


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



  Payment.createPayment(
    invoice_id,
    student_id,
    Number(
        amount_paid.replace(/\s/g, "")
    ),
    payment_method,
    reference_number
);


    Invoice.updatePaymentStatus(
        invoice_id
    );


    res.redirect(
        "/admin/payments"
    );

};