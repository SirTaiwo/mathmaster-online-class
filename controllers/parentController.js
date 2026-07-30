const Student =
    require("../models/Student");

const Parent =
    require("../models/Parent");

const AssessmentResult =
    require("../models/AssessmentResult");


// ========================================
// PARENT DASHBOARD
// ========================================

exports.dashboard = (req, res) => {


    const parent =
        Student.findById(
            req.session.student.id
        );


    if (!parent) {

        return req.session.destroy(() => {

            res.redirect("/login");

        });

    }


    const children =
        Parent.findChildren(
            parent.id
        );


    const childrenData =
        children.map(child => {


            const performance =
                AssessmentResult.getStudentPerformance(
                    child.id
                );


            return {

                ...child,

                performance

            };


        });



    res.render(

        "parent-dashboard",

        {

            user: parent,

            children:
                childrenData

        }

    );


};