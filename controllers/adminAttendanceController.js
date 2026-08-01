const Attendance =
    require("../models/Attendance");


// ========================================
// ADMIN ATTENDANCE REPORT
// ========================================

exports.report = (req, res) => {


    const summary =
        Attendance.getAttendanceSummary();


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const daily =
        Attendance.getDailyAttendanceSummary(
            today
        );


    res.render(
        "admin-attendance-report",
        {
            summary,
            daily,
            today
        }
    );

};