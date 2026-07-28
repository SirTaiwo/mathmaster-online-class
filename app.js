const express = require("express");
const path = require("path");
const session = require("express-session");


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