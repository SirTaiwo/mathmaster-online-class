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


    const invoices =
        Invoice.findAll();


    res.render(
        "admin-payments",
        {
            payments,
            invoices
        }
    );

};



// ========================================
// ADD PAYMENT
// ========================================

exports.create = (req, res) => {

    const {

        invoice_id,

        amount_paid,

        payment_method,

        reference_number

    } = req.body;


    console.log(
        "PAYMENT DATA:",
        req.body
    );


    // ----------------------------------------
    // FIND SELECTED INVOICE
    // ----------------------------------------

    const invoice =
        Invoice.findById(invoice_id);


    if (!invoice) {

        return res.status(400).send(
            "Invoice not found."
        );

    }


    // ----------------------------------------
    // GET STUDENT FROM INVOICE
    // ----------------------------------------

    const student_id =
        invoice.student_id;


    // ----------------------------------------
    // RECORD PAYMENT
    // ----------------------------------------

    try {

        const paymentResult =
            Payment.createPayment(

                invoice_id,

                student_id,

                amount_paid,

                payment_method,

                reference_number

            );


        res.redirect(
            "/admin/payments"
        );

    } catch (error) {

        console.error(
            "Payment error:",
            error
        );


        return res.status(400).send(
            error.message
        );

    }

};