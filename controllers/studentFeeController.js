const StudentFee =
    require("../models/StudentFee");

const Student =
    require("../models/Student");

const FeeStructure =
    require("../models/FeeStructure");


// ========================================
// VIEW STUDENT FEES
// ========================================

exports.index = (req, res) => {

    const fees =
        StudentFee.findAll();


    const students =
        Student.findAll();


    const feeStructures =
        FeeStructure.findAll();


    res.render(
        "admin-student-fees",
        {

            user:
                req.session.student,

            fees,

            students,

            feeStructures

        }
    );

};


// ========================================
// ASSIGN FEE TO STUDENT
// ========================================

exports.create = (req, res) => {


    const {

        student_id,

        fee_structure_id,

        term,

        year

    } = req.body;



    const fee =
        FeeStructure.findById(
            fee_structure_id
        );



    StudentFee.create(

        student_id,

        fee_structure_id,

        term,

        year,

        fee.amount

    );


    res.redirect(
        "/admin/student-fees"
    );

};