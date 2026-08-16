const Attendance =
    require("../models/Attendance");


// ========================================
// STUDENT ATTENDANCE DASHBOARD
// ========================================

exports.index = (req, res) => {

    const studentId =
        req.session.student.id;


    const attendance =
        Attendance.findByStudent(
            studentId
        );


    const summary =
        Attendance.getStudentAttendanceSummary(
            studentId
        );


    const total =
        Number(summary.total || 0);


    const present =
        Number(summary.present || 0);


    const absent =
        Number(summary.absent || 0);


    const late =
        Number(summary.late || 0);


    const excused =
        Number(summary.excused || 0);


    const attendanceRate =
        total > 0
            ? Math.round(
                (present / total) * 100
              )
            : 0;


    res.render(
        "student-attendance",
        {

            user:
                req.session.student,

            attendance,

            summary: {

                total,

                present,

                absent,

                late,

                excused,

                attendanceRate

            }

        }
    );

};
