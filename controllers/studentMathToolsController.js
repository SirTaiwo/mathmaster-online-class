const renderTool = (view) => (req, res) => {
    res.render(view, {
        user: req.session.student
    });
};

// ========================================
// STUDENT MATHEMATICS LIBRARY
// ========================================

exports.index = renderTool("student-math-tools");

// ========================================
// STUDENT CALCULATOR
// ========================================

exports.calculator = renderTool("student-calculator");

// ========================================
// STUDENT GEOMETRY
// ========================================

exports.geometry = renderTool("student-geometry-tools");

// ========================================
// STUDENT GRAPHING
// ========================================

exports.graphing = renderTool("student-graphing-tools");

// ========================================
// STUDENT FORMULA LIBRARY
// ========================================

exports.formulas = renderTool("student-formula-library");

// ========================================
// STUDENT STATISTICS
// ========================================

exports.statistics = renderTool("student-statistics");
