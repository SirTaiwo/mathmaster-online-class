const ClassModel = require("../models/Class");
const Student = require("../models/Student");


// ========================================
// VIEW ALL CLASSES
// ========================================

exports.index = (req, res) => {

    const classes =
        ClassModel.findAll();


    const allUsers =
        Student.findAll();


    console.log(
        "ALL USERS:",
        allUsers
    );


    const teachers =
        allUsers.filter(
            user => user.role === "teacher"
        );


    console.log(
        "TEACHERS ONLY:",
        teachers
    );


    res.render(
        "admin-classes",
        {
            user: req.session.student,

            classes,

            teachers,

            error: null,

            success: null
        }
    );

};


// ========================================
// CREATE CLASS
// ========================================

exports.create = (req, res) => {

    const {
        class_name,
        grade,
        teacher_id
    } = req.body;


    if (
        !class_name ||
        !grade
    ) {

        return res.redirect(
            "/admin/classes"
        );

    }


    ClassModel.createClass(
        class_name,
        grade,
        teacher_id || null
    );


    res.redirect(
        "/admin/classes"
    );

};



// ========================================
// DELETE CLASS
// ========================================

exports.delete = (req, res) => {


    ClassModel.deleteClass(
        req.params.id
    );


    res.redirect(
        "/admin/classes"
    );

};

// ========================================
// VIEW CLASS DETAILS
// ========================================

exports.details = (req, res) => {

    const classInfo =
        ClassModel.findById(
            req.params.id
        );


    const students =
        ClassModel.getClassStudents(
            req.params.id
        );


    const availableStudents =
        ClassModel.getAvailableStudents();


    if (!classInfo) {

    return res.redirect(
        "/admin/classes"
    );

}


res.render(
    "admin-class-details",
    {
        user:
            req.session.student,

        classInfo,

        students,

        availableStudents
    }
);

};



// ========================================
// ADD STUDENT TO CLASS
// ========================================

exports.addStudent = (req, res) => {

    ClassModel.addStudent(
        req.params.id,
        req.body.student_id
    );


    res.redirect(
        `/admin/classes/${req.params.id}`
    );

};