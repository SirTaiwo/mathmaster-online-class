const Student =
    require("../models/Student");

const bcrypt =
    require("bcryptjs");

const Enrollment =
    require("../models/Enrollment");

const Course =
    require("../models/Course");


// ========================================
// STUDENT DASHBOARD
// ========================================

exports.dashboard = (req, res) => {

    const student =
        Student.findById(
            req.session.student.id
        );


    if (!student) {

        return req.session.destroy(() => {

            res.redirect("/login");

        });

    }


   const stats =
    Student.getStatistics();


res.render(
    "dashboard",
    {
        user: student,

        stats
    }
);

};
// ========================================
// ADMIN - LIST STUDENTS
// ========================================

exports.listStudents = (req, res) => {

    const students =
        Student.findAllStudents();


    res.render(
        "admin-students",
        {
            user:
                req.session.student,

            students,

            error: null,

            success: null
        }
    );

};
// ========================================
// ADMIN - CREATE STUDENT
// ========================================

exports.createStudent = async (req, res) => {

    const {
        first_name,
        last_name,
        email,
        password,
        grade
    } = req.body;


    if (
        !first_name ||
        !last_name ||
        !email ||
        !password ||
        !grade
    ) {

        return res.render(
            "admin-students",
            {
                user: req.session.student,

                students:
                    Student.findAllStudents(),

                error:
                    "Please complete all fields.",

                success: null
            }
        );

    }


    if (password.length < 6) {

        return res.render(
            "admin-students",
            {
                user: req.session.student,

                students:
                    Student.findAllStudents(),

                error:
                    "Password must be at least 6 characters.",

                success: null
            }
        );

    }


    const existingUser =
        Student.findByEmail(email);


    if (existingUser) {

        return res.render(
            "admin-students",
            {
                user: req.session.student,

                students:
                    Student.findAllStudents(),

                error:
                    "Email already exists.",

                success: null
            }
        );

    }


    try {

        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );


        Student.createStudent(
            first_name,
            last_name,
            email,
            hashedPassword,
            grade
        );


        res.redirect(
            "/admin/students"
        );


    } catch(error) {

        console.error(
            "Student creation error:",
            error
        );


        res.render(
            "admin-students",
            {
                user: req.session.student,

                students:
                    Student.findAllStudents(),

                error:
                    "Unable to create student.",

                success: null
            }
        );

    }

};
// ========================================
// EDIT STUDENT FORM
// ========================================

exports.editStudentForm = (req, res) => {

    const student =
        Student.findById(
            req.params.id
        );


    if (!student) {

        return res.redirect(
            "/admin/students"
        );

    }


    res.render(
        "edit-student",
        {
            user:
                req.session.student,

            student,

            error: null,

            success: null
        }
    );

};



// ========================================
// UPDATE STUDENT
// ========================================

exports.updateStudent = (req, res) => {

    const {
        first_name,
        last_name,
        email,
        grade
    } = req.body;

    console.log("UPDATE STUDENT DATA:");
console.log(req.params.id);
console.log(req.body);


    try {

        Student.updateStudent(
            req.params.id,
            first_name,
            last_name,
            email,
            grade
        );


        res.redirect(
            "/admin/students"
        );


    } catch(error) {

        console.error(
            "Student update error:",
            error
        );


        res.redirect(
            "/admin/students"
        );

    }

};



// ========================================
// DELETE STUDENT
// ========================================

exports.deleteStudent = (req, res) => {

    const student =
        Student.findById(
            req.params.id
        );


    if (!student) {

        return res.redirect(
            "/admin/students"
        );

    }


    Student.deleteUser(
        req.params.id
    );


    res.redirect(
        "/admin/students"
    );

};

// ========================================
// VIEW AVAILABLE COURSES
// ========================================

exports.courses = (req, res) => {


    const courses =
        Course.findAllCourses();


    res.render(
        "student-courses",
        {

            user:
                req.session.student,

            courses,

            message: null

        }
    );

};




// ========================================
// ENROLL IN COURSE
// ========================================

exports.enroll = (req, res) => {


    const studentId =
        req.session.student.id;


    const courseId =
        req.params.id;


    const enrolled =
        Enrollment.enrollStudent(
            studentId,
            courseId
        );


    res.render(
        "student-courses",
        {

            user:
                req.session.student,

            courses:
                Course.findAllCourses(),

            message:

                enrolled

                ? "Course enrolled successfully."

                : "You are already enrolled in this course."

        }
    );


};