const Student =
    require("../models/Student");

const Parent =
    require("../models/Parent");

const AssessmentResult =
    require("../models/AssessmentResult");

    const Enrollment =
    require("../models/Enrollment");

const StudentFeedback =
    require("../models/StudentFeedback");

    const Invoice =
    require("../models/Invoice");

    const Payment =
    require("../models/Payment");

    const Receipt = require("../models/Receipt");

    const Attendance =
    require("../models/Attendance");


// ========================================
// PARENT DASHBOARD
// ========================================

exports.dashboard = (req, res) => {


    const parent =
        Student.findById(
            req.session.student.id
        );


    if (!parent) {

        return req.session.destroy(() => {

            res.redirect("/login");

        });

    }


    const children =
        Parent.findChildren(
            parent.id
        );


    const childrenData =
        children.map(child => {

const attendance =
    Attendance.findByStudent(
        child.id
    );

            const performance =
    AssessmentResult.getStudentPerformance(
        child.id
    );

const progressTrend =
    AssessmentResult.getProgressTrend(
        child.id
    );

const assessmentHistory =
    AssessmentResult.findByStudent(
        child.id
    );

    const invoices =
    Invoice.findByStudent(child.id);

    const payments =
    Payment.findByStudent(child.id);

const receipts =
    Receipt.findByStudent(
        child.id
    );

const courses =
    Enrollment.findCoursesByStudent(
        child.id
    );

const feedback =
    StudentFeedback.findByStudent(
        child.id
    );

return {

    ...child,

    performance,

    progressTrend,

    assessmentHistory,

    courses,

    feedback,

    invoices,

    payments,

    receipts,

    attendance

};

        });



res.render(
    "parent-dashboard",
    {
        children: childrenData,
        user: parent
    }
);


};