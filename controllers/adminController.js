const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

// ========================================
// ADMIN DASHBOARD
// ========================================

exports.dashboard = (req, res) => {

    const stats =
        Student.getStatistics();

    const users =
        Student.findAll();

    const recentUsers =
        Student.getRecentUsers();


    res.render(
        "admin-dashboard",
        {
            user:
                req.session.student,

            stats,

            users,

            recentUsers
        }
    );

};

// ========================================
// MANAGE USERS PAGE
// ========================================

exports.users = (req, res) => {

  const stats = Student.getStatistics();

const users = Student.findAll();

const recentUsers = Student.getRecentUsers();

    res.render(
        "admin-users",
        {
            user:
                req.session.student,

            users,

            stats,

            error: null,

            success: null
        }
    );

};
// ========================================
// CREATE TEACHER
// ========================================

exports.createTeacher = async (req, res) => {

    const {
        first_name,
        last_name,
        email,
        password
    } = req.body;

    if (
        !first_name ||
        !last_name ||
        !email ||
        !password
    ) {

        return res.render("admin-users", {
            user: req.session.student,
            users: Student.findAll(),
            stats: Student.getStatistics(),
            error: "Please complete all fields.",
            success: null
        });

    }

    if (password.length < 6) {

        return res.render("admin-users", {
            user: req.session.student,
            users: Student.findAll(),
            stats: Student.getStatistics(),
            error: "Password must be at least 6 characters.",
            success: null
        });

    }

    const existingUser =
        Student.findByEmail(email);

    if (existingUser) {

        return res.render("admin-users", {
            user: req.session.student,
            users: Student.findAll(),
            stats: Student.getStatistics(),
            error: "A user with this email already exists.",
            success: null
        });

    }

    try {

        const hashedPassword =
            await bcrypt.hash(password, 12);

        Student.createTeacher(
            first_name,
            last_name,
            email,
            hashedPassword
        );

        res.render("admin-users", {
            user: req.session.student,
            users: Student.findAll(),
            stats: Student.getStatistics(),
            error: null,
            success: "Teacher account created successfully."
        });

    } catch (error) {

        console.error(
            "Teacher creation error:",
            error
        );

        res.render("admin-users", {
            user: req.session.student,
            users: Student.findAll(),
            stats: Student.getStatistics(),
            error: "Unable to create teacher account.",
            success: null
        });

    }

};
// ========================================
// EDIT USER - DISPLAY FORM
// ========================================

exports.editUserForm = (req, res) => {

    const member =
        Student.findById(req.params.id);

    if (!member) {

        return res.redirect(
            "/admin/users"
        );

    }

    res.render(
        "edit-user",
        {
            user:
                req.session.student,

            member,

            error: null,

            success: null
        }
    );

};
// ========================================
// EDIT USER - SAVE CHANGES
// ========================================

exports.updateUser = (req, res) => {

    const {
        first_name,
        last_name,
        email,
        role
    } = req.body;


    try {

        Student.updateUser(
            req.params.id,
            first_name,
            last_name,
            email,
            role
        );


        res.redirect(
            "/admin/users"
        );


    } catch (error) {

        console.error(
            "Update user error:",
            error
        );


        res.render(
            "edit-user",
            {
                user:
                    req.session.student,

                member:
                    Student.findById(
                        req.params.id
                    ),

                error:
                    "Unable to update user.",

                success:
                    null
            }
        );

    }

};
// ========================================
// DELETE USER
// ========================================

exports.deleteUser = (req, res) => {

    const member =
        Student.findById(req.params.id);


    if (!member) {

        return res.redirect(
            "/admin/users"
        );

    }


    if (member.role === "admin") {

        return res.redirect(
            "/admin/users"
        );

    }


    Student.deleteUser(
        req.params.id
    );


    res.redirect(
        "/admin/users"
    );

};


// ========================================
// TEACHER MANAGEMENT
// ========================================

exports.teachers = (req, res) => {

    const teachers =
        Student.findAllTeachers();

    res.render(
        "admin-teachers",
        {
            user: req.session.student,
            teachers
        }
    );

};