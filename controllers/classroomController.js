const ClassroomSession =
    require("../models/ClassroomSession");

const Course =
    require("../models/Course");


// ========================================
// START CLASSROOM SESSION
// ========================================

exports.startSession = (req, res) => {

    const teacherId =
        req.session.student.id;

    const courseId =
        Number(req.params.courseId);


    const course =
        Course.findById(courseId);


    if (!course) {

        return res.status(404).render(
            "403"
        );

    }


    // ========================================
    // VERIFY COURSE OWNERSHIP
    // ========================================

    if (
        course.teacher_id !==
        teacherId
    ) {

        return res.status(403).render(
            "403"
        );

    }


    // ========================================
    // PREVENT DUPLICATE ACTIVE SESSION
    // ========================================

    const activeSession =
        ClassroomSession.findActiveByCourse(
            courseId
        );


    if (activeSession) {

        return res.redirect(
            `/teacher/courses/${courseId}/lessons`
        );

    }


    // ========================================
    // CREATE SESSION
    // ========================================

    ClassroomSession.createSession(
        courseId,
        teacherId
    );


    res.redirect(
        `/teacher/courses/${courseId}/lessons`
    );

};


// ========================================
// END CLASSROOM SESSION
// ========================================

exports.endSession = (req, res) => {

    const teacherId =
        req.session.student.id;

    const sessionId =
        Number(req.params.sessionId);


    const session =
        ClassroomSession.findById(
            sessionId
        );


    if (!session) {

        return res.status(404).render(
            "403"
        );

    }


    // ========================================
    // VERIFY SESSION OWNERSHIP
    // ========================================

    if (
        session.teacher_id !==
        teacherId
    ) {

        return res.status(403).render(
            "403"
        );

    }


    // ========================================
    // END SESSION
    // ========================================

    ClassroomSession.endSession(
        sessionId
    );


    res.redirect(
        `/teacher/courses/${session.course_id}/lessons`
    );

};
