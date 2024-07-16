import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import StudentRepository from "../database/studentRepository.js";
import TeacherRepository from "../database/teacherRepository.js";

const studentRepository = new StudentRepository();
const teacherRepository = new TeacherRepository();

class AuthController {
    login = async (req, res) => {
        try {
            const { email, password, type } = req.body;

            if (!email || !password || !type) {
                return this.renderError(res, "Missing parameters");
            }

            let repository, accountType;

            if (type === "student") {
                repository = studentRepository;
                accountType = "student";
            } else if (type === "teacher") {
                repository = teacherRepository;
                accountType = "teacher";
            } else {
                return this.renderError(res, "Invalid account type");
            }

            const user = await repository.findOneByEmail(email);
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return this.renderError(
                    res,
                    "User does not exist or invalid password",
                );
            }

            if (type === "teacher" && user.id === 0) {
                accountType = "admin";
            }

            const token = this.generateToken(user.id, user.email, accountType);
            res.cookie("token", token);
            res.redirect(`/${accountType}/dashboard`);
        } catch (error) {
            console.error("Login error:", error);
            this.renderError(res, "Internal server error");
        }
    };

    logout = (req, res) => {
        res.clearCookie("token");
        res.redirect("/login");
    };

    renderError(res, errorMessage) {
        return res.render("error", { error: errorMessage });
    }

    generateToken(id, email, role) {
        return jwt.sign({ id, email, role }, process.env.SECRET_KEY);
    }
}

export default AuthController;
