const express = require("express");
const bcrypt = require("bcryptjs");

const Student = require("../models/Student");

const router = express.Router();


// ========================================
// REGISTER PAGE
// ========================================

router.get("/register", (req, res) => {

    res.render("register", {
        error: null
    });

});


// ========================================
// REGISTER STUDENT
// ========================================

router.post("/register", async (req, res) => {

    const {
        first_name,
        last_name,
        email,
        password,
        grade
    } = req.body;


    // Validate fields

    if (
        !first_name ||
        !last_name ||
        !email ||
        !password ||
        !grade
    ) {

        return res.render("register", {
            error: "Please complete all fields."
        });

    }


    // Check password length

    if (password.length < 6) {

        return res.render("register", {
            error: "Password must be at least 6 characters."
        });

    }


    try {

        // Check whether email already exists

        const existingStudent =
            Student.findByEmail(email);


        if (existingStudent) {

            return res.render("register", {
                error:
                    "An account with this email already exists."
            });

        }


        // Hash password

        const hashedPassword =
            await bcrypt.hash(password, 12);


        // Create student

        Student.createStudent(
            first_name,
            last_name,
            email,
            hashedPassword,
            grade
        );


        // Send student to login

        res.redirect("/login");

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.render("register", {
            error:
                "Registration failed. Please try again."
        });

    }

});


// ========================================
// LOGIN PAGE
// ========================================

router.get("/login", (req, res) => {

    res.render("login", {
        error: null
    });

});


// ========================================
// LOGIN STUDENT
// ========================================

router.post("/login", async (req, res) => {

    const {
        email,
        password
    } = req.body;


    try {

        // Find student

        const student =
            Student.findByEmail(email);
            console.log("========== LOGIN ==========");
console.log("Email entered:", email);
console.log("User found:", student);


        if (!student) {

            return res.render("login", {
                error:
                    "Invalid email or password."
            });

        }


        // Compare password

        const passwordCorrect =
            await bcrypt.compare(
                password,
                student.password
            );
            console.log("Password correct:", passwordCorrect);


        if (!passwordCorrect) {

            return res.render("login", {
                error:
                    "Invalid email or password."
            });

        }


        // Create session

      req.session.student = {

    id: student.id,

    first_name:
        student.first_name,

    last_name:
        student.last_name,

    email:
        student.email,

    grade:
        student.grade,

    role:
        student.role

};
console.log("Role:", student.role);


        // Go to dashboard

        if (student.role === "admin") {

    return res.redirect(
        "/admin/dashboard"
    );

}


if (student.role === "teacher") {

    return res.redirect(
        "/teacher/dashboard"
    );

}


if (student.role === "parent") {

    return res.redirect(
        "/parent/dashboard"
    );

}


return res.redirect(
    "/student/dashboard"
);

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.render("login", {
            error:
                "Login failed. Please try again."
        });

    }

});


// ========================================
// LOGOUT
// ========================================

router.get("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error(
                "Logout error:",
                error
            );

            return res.redirect("/");

        }


        res.redirect("/");

    });

});


module.exports = router;