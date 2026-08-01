const express = require("express");
const path = require("path");
const session = require("express-session");

const studentAssessmentRoutes =
    require("./routes/studentAssessment");


// Load database

require("./database/database");


// Load routes

// Load routes

const authRoutes =
    require("./routes/auth");

const studentRoutes =
    require("./routes/student");

    const teacherRoutes =
    require("./routes/teacher");


const adminRoutes =
    require("./routes/admin");

    const courseRoutes =
    require("./routes/course");

    const lessonRoutes =
    require("./routes/lesson");

    const assessmentRoutes =
    require("./routes/assessment");

    const assessmentQuestionRoutes =
    require("./routes/assessmentQuestion");

    const teacherAssessmentRoutes =
    require("./routes/teacherAssessment");

    const leaderboardRoutes =
    require("./routes/leaderboard");

    const studentPerformanceRoutes =
    require("./routes/studentPerformance");

    const parentRoutes =
    require("./routes/parent");

    const financeRoutes =
    require("./routes/finance");

    const studentFeeRoutes =
    require("./routes/studentFee");

    const paymentRoutes =
    require("./routes/payment");

    const attendanceRoutes =
    require("./routes/attendance");

    const adminAttendanceRoutes =
require("./routes/adminAttendance");




const app = express();

const PORT = 3000;


// ========================================
// VIEW ENGINE
// ========================================

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);


// ========================================
// MIDDLEWARE
// ========================================

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());


app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ========================================
// SESSION
// ========================================


app.use(
    session({

        secret:
            "mathmaster-secret-key",

        resave: false,

        saveUninitialized: false,

        cookie: {

            maxAge:
                1000 * 60 * 60

        }

    })
);


// ========================================
// HOME PAGE
// ========================================

app.get("/", (req, res) => {

    res.render("home", {

        student:
            req.session.student || null

    });

});


// ========================================
// AUTHENTICATION ROUTES
// ========================================

app.use(
    "/",
    authRoutes
);

// ========================================
// STUDENT ROUTES
// ========================================

app.use(
    "/",
    studentRoutes
);
// ========================================
// TEACHER ROUTES
// ========================================
app.use(
    "/",
    teacherRoutes
);
// ========================================
// ADMIN ROUTES
// ========================================

app.use(
    "/",
    adminRoutes
);
app.use(
    "/",
    courseRoutes
);
app.use(
    "/",
    lessonRoutes
);
app.use(
    require("./routes/exercise")
);
app.use(
    "/",
    require("./routes/gradebook")
);
app.use(
    "/",
    assessmentRoutes
);

    
app.use(
    "/",
    teacherAssessmentRoutes
);

app.use(
    "/",
    leaderboardRoutes
);

app.use(
    "/",
    require("./routes/assessmentGradebook")
);

app.use(
    "/",
    require("./routes/assessmentManagement")
);

app.use(
    "/",
    require("./routes/invoice")
);

app.use(
    studentPerformanceRoutes
);

app.use(
    parentRoutes
);

app.use(
    financeRoutes
);

app.use(paymentRoutes);

app.use(
    require("./routes/receipt")
);

app.use(attendanceRoutes);

app.use(adminAttendanceRoutes);

// ========================================
// STUDENT ASSESSMENT ROUTES
// ========================================

app.use(
    "/",
    studentAssessmentRoutes
);

app.use(
    studentFeeRoutes
);




// ========================================
// 404 PAGE
// ========================================

app.use((req, res) => {

    res.status(404).send(
        "Page not found"
    );

});


// ========================================
// START SERVER
// ========================================

app.listen(
    PORT,
    () => {

        console.log(`
=========================================
   MathMaster Online Class
=========================================

   Server running at:
   http://localhost:${PORT}

=========================================
        `);

    }
);