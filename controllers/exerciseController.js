const Exercise =
    require("../models/Exercise");

const Lesson =
    require("../models/Lesson");

const Submission =
    require("../models/Submission");

const StudentMediaRecording =
    require("../models/StudentMediaRecording");

// ========================================
// CREATE EXERCISE FORM
// ========================================

exports.createExerciseForm = (req, res) => {


    const lesson =
        Lesson.findById(
            req.params.lessonId
        );


    if (!lesson) {

        return res.redirect(
            "/teacher/courses"
        );

    }


    res.render(
        "create-exercise",
        {

            user:
                req.session.student,

            lesson,

            error: null,

            success: null

        }
    );

};



// ========================================
// SAVE EXERCISE
// ========================================

exports.createExercise = (req, res) => {


    const {
        question,
        answer,
        marks
    } = req.body;



    Exercise.createExercise(

        req.params.lessonId,

        question,

        answer,

        marks

    );


    res.redirect(
        `/teacher/courses/${req.params.courseId}/lessons`
    );


};
// ========================================
// STUDENT VIEW EXERCISE
// ========================================

exports.viewExercise = (req, res) => {


    const exercise =
        Exercise.findById(
            req.params.id
        );


    if (!exercise) {

        return res.redirect(
            "/student/my-courses"
        );

    }


    const submissions =
        Submission.findByStudentAndExercise(

            req.session.student.id,

            exercise.id

        );

        const recordings =
    StudentMediaRecording.findByStudentAndExercise(

        req.session.student.id,

        exercise.id

    );


    res.render(
        "student-exercise",
        {

            user:
                req.session.student,

            exercise,

            submissions,

            recordings,

            result: null

        }
    );

};




// ========================================
// STUDENT SUBMIT ANSWER
// ========================================

exports.submitAnswer = (req, res) => {


    const exercise =
        Exercise.findById(
            req.params.id
        );


    if (!exercise) {

        return res.redirect(
            "/student/my-courses"
        );

    }


    const studentAnswer =
        req.body.answer;


   let result;

let correct = 0;

let marks = 0;


if (
    studentAnswer.trim().toLowerCase()
    ===
    exercise.answer.trim().toLowerCase()
) {

    correct = 1;

    marks = exercise.marks;

    result =
        "✅ Correct! Well done.";

} else {

    result =
        "❌ Incorrect. Try again.";

}
const submissionResult =
    Submission.createSubmission(

        req.session.student.id,

        exercise.id,

        studentAnswer,

        correct,

        marks

    );

const submissionId =
    submissionResult.lastInsertRowid;



        const submissions =
        Submission.findByStudentAndExercise(

            req.session.student.id,

            exercise.id

        );

        const recordings =
        StudentMediaRecording.findByStudentAndExercise(

            req.session.student.id,

            exercise.id

        );




    res.render(
        "student-exercise",
        {

            user:
                req.session.student,

            exercise,

            submissions,

            recordings,

            result

        }
    );


};