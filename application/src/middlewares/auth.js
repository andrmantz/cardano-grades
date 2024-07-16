import jwt from "jsonwebtoken";

export const authenticateAny = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err || !user.role) {
                res.redirect("/login");
            }

            req.userRole = user.role;
            next();
        });
    } else {
        res.redirect("/login");
    }
};

export const authenticateStudent = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err || !user.role || user.role != "student") {
                res.redirect("/login");
            }

            req.userData = user;
            next();
        });
    } else {
        res.redirect("/login");
    }
};

export const authenticateTeacher = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err || !user.role || user.role != "teacher") {
                res.redirect("/login");
            }

            req.userData = user;
            next();
        });
    } else {
        res.redirect("/login");
    }
};

export const authenticateAdmin = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err || !user.role || user.role != "admin") {
                res.redirect("/login");
            }

            req.userData = user;
            next();
        });
    } else {
        res.redirect("/login");
    }
};
