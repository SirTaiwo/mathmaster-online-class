// ========================================
// TEACHER MATHEMATICS TOOLS
// ========================================

exports.index = (req, res) => {

    res.render(
        "teacher-math-tools",
        {
            user: req.session.user
        }
    );

};


// ========================================
// GEOMETRY WORKSPACE
// ========================================

exports.geometry = (req, res) => {

    res.render(
        "teacher-geometry-tools",
        {
            user: req.session.user
        }
    );

};