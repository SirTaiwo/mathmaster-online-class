// ========================================
// REQUIRE LOGIN
// ========================================

function requireLogin(req, res, next) {

   if (!req.session || !req.session.student) {

        return res.redirect("/login");

    }

    next();

}


// ========================================
// REQUIRE SPECIFIC ROLE
// ========================================

function requireRole(...allowedRoles) {

    return (req, res, next) => {

        if (!req.session || !req.session.student) {

            return res.redirect("/login");

        }


        const userRole =
            req.session.student.role;


        if (!allowedRoles.includes(userRole)) {

            return res.status(403).render(
                "403"
            );

        }


        next();

    };

}


module.exports = {
    requireLogin,
    requireRole
};