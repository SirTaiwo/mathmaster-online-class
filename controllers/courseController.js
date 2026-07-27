const Course =
    require("../models/Course");


// ========================================
// VIEW TEACHER COURSES
// ========================================

exports.myCourses = (req, res) => {

    const courses =
        Course.findByTeacher(
            req.session.student.id
        );


    res.render(
        "teacher-courses",
        {
            user:
                req.session.student,

            courses,

            error: null,

            success: null
        }
    );

};



// ========================================
// CREATE COURSE FORM
// ========================================

exports.createCourseForm = (req, res) => {


    res.render(
        "create-course",
        {
            user:
                req.session.student,

            error: null,

            success: null
        }
    );


};



// ========================================
// SAVE NEW COURSE
// ========================================

exports.createCourse = (req, res) => {

    const {
        title,
        description,
        grade
    } = req.body;


    try {

        Course.createCourse(

            req.session.student.id,

            title,

            description,

            grade

        );


        res.redirect(
            "/teacher/courses"
        );


    } catch(error) {


        console.error(
            "Course creation error:",
            error
        );


        res.redirect(
            "/teacher/courses"
        );

    }

};



// ========================================
// DELETE COURSE
// ========================================

exports.deleteCourse = (req, res) => {


    Course.deleteCourse(
        req.params.id
    );


    res.redirect(
        "/teacher/courses"
    );


};