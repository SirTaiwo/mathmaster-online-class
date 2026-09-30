const bcrypt = require("bcryptjs");

const db = require("../database/database");


async function createAdmin() {

    const firstName = "System";
    const lastName = "Administrator";

    const email =
        process.env.ADMIN_EMAIL;

    const password =
        process.env.ADMIN_PASSWORD;


    // Validate required environment variables

    if (!email || !password) {

        console.error(`
========================================
Missing admin credentials
========================================

Please set:

ADMIN_EMAIL
ADMIN_PASSWORD

before running this script.

========================================
        `);

        process.exit(1);

    }


    // Check if admin already exists

    const existingAdmin = db.prepare(`
        SELECT id
        FROM students
        WHERE email = ?
    `).get(email);


    if (existingAdmin) {

        console.log(
            "Admin account already exists."
        );

        process.exit();

    }


    // Hash password

    const hashedPassword =
        await bcrypt.hash(password, 12);


    // Create admin

    db.prepare(`
        INSERT INTO students
        (
            first_name,
            last_name,
            email,
            password,
            grade,
            role
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(
        firstName,
        lastName,
        email,
        hashedPassword,
        "N/A",
        "admin"
    );


    console.log(`
========================================
 Admin account created successfully
========================================

Email:
${email}

Role:
admin

========================================
IMPORTANT:
Change this password after logging in.
========================================
    `);


    process.exit();

}


createAdmin();
