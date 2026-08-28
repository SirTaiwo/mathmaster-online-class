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

// ========================================
// GRAPHING WORKSPACE
// ========================================

exports.graphing = (req, res) => {

    res.render(
        "teacher-graphing-tools",
        {
            user: req.session.user
        }
    );

};

// ========================================
// FORMULA LIBRARY
// ========================================

exports.formulas = (req, res) => {

    res.render(
        "teacher-formula-library",
        {
            user: req.session.user
        }
    );

};
