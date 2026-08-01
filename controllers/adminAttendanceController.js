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

        const ranking =
    Attendance.getStudentAttendanceRanking();


const lowAttendance =
    Attendance.getLowAttendanceStudents();

    const monthlyTrend =
    Attendance.getMonthlyAttendanceTrend();


    // =========================
    // ATTENDANCE ANALYTICS
    // =========================

    const totalRecords =
        summary.reduce(
            (total, item) =>
                total + item.total,
            0
        );


    let presentPercentage = 0;
    let absentPercentage = 0;
    let latePercentage = 0;


    if (totalRecords > 0) {


        summary.forEach(item => {


            const percentage =
                Math.round(
                    (item.total / totalRecords) * 100
                );


            if (item.status === "Present") {

                presentPercentage =
                    percentage;

            }


            if (item.status === "Absent") {

                absentPercentage =
                    percentage;

            }


            if (item.status === "Late") {

                latePercentage =
                    percentage;

            }


        });

    }



    res.render(
        "admin-attendance-report",
        {

            summary,

            daily,

            today,

            totalRecords,

            presentPercentage,

            absentPercentage,

            latePercentage,

            ranking,

            lowAttendance,

            monthlyTrend

        }
    );


};