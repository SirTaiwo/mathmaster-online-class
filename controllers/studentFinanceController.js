const StudentFee =
    require("../models/StudentFee");

const Invoice =
    require("../models/Invoice");

const Payment =
    require("../models/Payment");

const Receipt =
    require("../models/Receipt");


// ========================================
// STUDENT FINANCE DASHBOARD
// ========================================

exports.index = (req, res) => {

    const studentId =
        req.session.student.id;


    const fees =
        StudentFee.findByStudent(
            studentId
        );


    const invoices =
        Invoice.findByStudent(
            studentId
        );


    const payments =
        Payment.findByStudent(
            studentId
        );


    const receipts =
        Receipt.findByStudent(
            studentId
        );


    const totalFees =
        fees.reduce(
            (total, fee) =>
                total + Number(fee.amount_due || 0),
            0
        );


    const totalPaid =
        invoices.reduce(
            (total, invoice) =>
                total + Number(invoice.amount_paid || 0),
            0
        );


    const totalBalance =
        invoices.reduce(
            (total, invoice) =>
                total + Number(invoice.balance || 0),
            0
        );


    res.render(
        "student-finance",
        {

            user:
                req.session.student,

            fees,

            invoices,

            payments,

            receipts,

            totalFees,

            totalPaid,

            totalBalance

        }
    );

};
