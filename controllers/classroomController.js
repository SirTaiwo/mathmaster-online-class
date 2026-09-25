const ClassroomSession =
    require("../models/ClassroomSession");

const Course =
    require("../models/Course");

const Enrollment =
    require("../models/Enrollment");

const ClassroomInteraction =
    require("../models/ClassroomInteraction");

    const ClassroomMessage =
    require("../models/ClassroomMessage");


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


// ========================================
// STUDENT JOIN CLASSROOM SESSION
// ========================================

exports.joinSession = (req, res) => {

    const studentId =
        req.session.student.id;

    const courseId =
        Number(req.params.courseId);


    // ========================================
    // VERIFY COURSE
    // ========================================

    const course =
        Course.findById(courseId);


    if (!course) {

        return res.status(404).render(
            "403"
        );

    }


    // ========================================
    // VERIFY STUDENT ENROLLMENT
    // ========================================

    const enrolled =
        Enrollment.isStudentEnrolled(
            studentId,
            courseId
        );


    if (!enrolled) {

        return res.status(403).render(
            "403"
        );

    }


    // ========================================
    // VERIFY ACTIVE CLASSROOM
    // ========================================

    const activeSession =
        ClassroomSession.findActiveByCourse(
            courseId
        );


    if (!activeSession) {

        return res.redirect(
            `/student/courses/${courseId}/lessons`
        );

    }

        const classroomMessages =
        ClassroomMessage.findByStudentAndSession(
            studentId,
            activeSession.id
        );


    // ========================================
    // OPEN CLASSROOM
    // ========================================

    res.render(
        "student-classroom",
        {

            user:
                req.session.student,

            course,

            activeSession,

            classroomMessages

        }
    );

};


// ========================================
// STUDENT CLASSROOM INTERACTION
// ========================================

exports.submitInteraction = (req, res) => {

    const studentId =
        req.session.student.id;

    const courseId =
        Number(req.params.courseId);

    const interactionType =
        req.body.interactionType;


    // ========================================
    // VERIFY COURSE
    // ========================================

    const course =
        Course.findById(courseId);


    if (!course) {

        return res.status(404).render(
            "403"
        );

    }


    // ========================================
    // VERIFY STUDENT ENROLLMENT
    // ========================================

    const enrolled =
        Enrollment.isStudentEnrolled(
            studentId,
            courseId
        );


    if (!enrolled) {

        return res.status(403).render(
            "403"
        );

    }


    // ========================================
    // VERIFY ACTIVE CLASSROOM
    // ========================================

    const activeSession =
        ClassroomSession.findActiveByCourse(
            courseId
        );


    if (!activeSession) {

        return res.redirect(
            `/student/courses/${courseId}/lessons`
        );

    }


    // ========================================
    // VERIFY INTERACTION TYPE
    // ========================================

    const allowedInteractions = [
        "understand",
        "not_sure",
        "need_help",
        "repeat",
        "raise_hand"
    ];


    if (
        !allowedInteractions.includes(
            interactionType
        )
    ) {

        return res.status(400).render(
            "403"
        );

    }


    // ========================================
    // SAVE INTERACTION
    // ========================================

    ClassroomInteraction.createInteraction(
        activeSession.id,
        studentId,
        interactionType
    );


    // ========================================
    // RETURN TO CLASSROOM
    // ========================================

    res.redirect(
        `/student/courses/${courseId}/classroom`
    );

};

// ========================================
// TEACHER ACKNOWLEDGE CLASSROOM INTERACTION
// ========================================

exports.acknowledgeInteraction = (req, res) => {

    const teacherId =
        req.session.student.id;

    const interactionId =
        Number(req.params.interactionId);


    // ========================================
    // FIND INTERACTION
    // ========================================

    const interaction =
        ClassroomInteraction.findById(
            interactionId
        );


    if (!interaction) {

        return res.status(404).render(
            "403"
        );

    }


    // ========================================
    // FIND CLASSROOM SESSION
    // ========================================

    const session =
        ClassroomSession.findById(
            interaction.session_id
        );


    if (!session) {

        return res.status(404).render(
            "403"
        );

    }


    // ========================================
    // VERIFY TEACHER OWNERSHIP
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
    // ACKNOWLEDGE INTERACTION
    // ========================================

    ClassroomInteraction.acknowledgeInteraction(
        interactionId
    );


    // ========================================
    // RETURN TO COURSE LESSONS
    // ========================================

    res.redirect(
        `/teacher/courses/${session.course_id}/lessons`
    );

};

// ========================================
// STUDENT CLASSROOM WRITTEN MESSAGE
// ========================================

exports.submitMessage = (req, res) => {

    const studentId =
        req.session.student.id;

    const courseId =
        Number(req.params.courseId);

    const message =
        (req.body.message || "").trim();


    // ========================================
    // VERIFY COURSE
    // ========================================

    const course =
        Course.findById(courseId);


    if (!course) {

        return res.status(404).render(
            "403"
        );

    }


    // ========================================
    // VERIFY STUDENT ENROLLMENT
    // ========================================

    const enrolled =
        Enrollment.isStudentEnrolled(
            studentId,
            courseId
        );


    if (!enrolled) {

        return res.status(403).render(
            "403"
        );

    }


    // ========================================
    // VERIFY ACTIVE CLASSROOM
    // ========================================

    const activeSession =
        ClassroomSession.findActiveByCourse(
            courseId
        );


    if (!activeSession) {

        return res.redirect(
            `/student/courses/${courseId}/lessons`
        );

    }


    // ========================================
    // VERIFY MESSAGE
    // ========================================

    if (!message) {

        return res.redirect(
            `/student/courses/${courseId}/classroom`
        );

    }


    // ========================================
    // SAVE MESSAGE
    // ========================================

    ClassroomMessage.createMessage(
        activeSession.id,
        studentId,
        message
    );


    // ========================================
    // RETURN TO CLASSROOM
    // ========================================

    res.redirect(
        `/student/courses/${courseId}/classroom`
    );

};

// ========================================
// TEACHER CLASSROOM MESSAGE RESPONSE
// ========================================

exports.respondToMessage = (req, res) => {

    const teacherId =
        req.session.student.id;

    const messageId =
        Number(req.params.messageId);


    // ========================================
    // FIND MESSAGE
    // ========================================

    const message =
        ClassroomMessage.findById(
            messageId
        );


    if (!message) {

        return res.status(404).render(
            "403"
        );

    }


    // ========================================
    // FIND CLASSROOM SESSION
    // ========================================

    const session =
        ClassroomSession.findById(
            message.session_id
        );


    if (!session) {

        return res.status(404).render(
            "403"
        );

    }


    // ========================================
    // VERIFY TEACHER OWNERSHIP
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
    // VERIFY RESPONSE
    // ========================================

    const teacherResponse =
        (req.body.teacherResponse || "").trim();


    if (!teacherResponse) {

        return res.redirect(
            `/teacher/courses/${session.course_id}/lessons`
        );

    }


    // ========================================
    // SAVE RESPONSE
    // ========================================

    ClassroomMessage.respondToMessage(
        messageId,
        teacherResponse
    );


    // ========================================
    // RETURN TO COURSE LESSONS
    // ========================================

    res.redirect(
        `/teacher/courses/${session.course_id}/lessons`
    );

};
