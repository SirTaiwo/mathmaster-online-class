const Lesson =
    require("../models/Lesson");

const Course =
    require("../models/Course");


// ========================================
// VIEW COURSE LESSONS
// ========================================

exports.lessons = (req, res) => {


    const course =
        Course.findById(
            req.params.courseId
        );


    if (!course) {

        return res.redirect(
            "/teacher/courses"
        );

    }


    const lessons =
        Lesson.findByCourse(
            req.params.courseId
        );


    res.render(
        "teacher-lessons",
        {

            user:
                req.session.student,

            course,

            lessons,

            error: null,

            success: null

        }
    );

};



// ========================================
// CREATE LESSON FORM
// ========================================

exports.createLessonForm = (req, res) => {


    const course =
        Course.findById(
            req.params.courseId
        );


    res.render(
        "create-lesson",
        {

            user:
                req.session.student,

            course,

            error: null,

            success: null

        }
    );

};



// ========================================
// SAVE LESSON
// ========================================

exports.createLesson = (req, res) => {

    console.log("=== CREATE LESSON ===");
    console.log("Course ID:", req.params.courseId);
    console.log("Body:", req.body);

    try {

        const { title, content } = req.body;

        const result = Lesson.createLesson(
            req.params.courseId,
            title,
            content
        );

        console.log("Insert result:", result);

        res.redirect(
            `/teacher/courses/${req.params.courseId}/lessons`
        );

    } catch (error) {

        console.error("Lesson creation error:", error);

        res.status(500).send(error.message);

    }

};
// ========================================
// DELETE LESSON
// ========================================

exports.deleteLesson = (req, res) => {


    Lesson.deleteLesson(
        req.params.id
    );


    res.redirect(
        `/teacher/courses/${req.params.courseId}/lessons`
    );


};