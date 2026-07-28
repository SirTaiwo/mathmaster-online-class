const Submission =
    require("../models/Submission");


exports.index = (req, res) => {


    const submissions =
        Submission.findAll();


    res.render(
        "teacher-gradebook",
        {

            user:
                req.session.student,

            submissions

        }
    );


};