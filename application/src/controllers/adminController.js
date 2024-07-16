import bcrypt from "bcryptjs";

import StudentRepository from "../database/studentRepository.js";
import TeacherRepository from "../database/teacherRepository.js";
import SubjectRepository from "../database/subjectRepository.js";
import TeacherDoesSubjectRepository from "../database/teacherDoesSubjectRepository.js";

const studentRepository = new StudentRepository();
const teacherRepository = new TeacherRepository();
const subjectRepository = new SubjectRepository();
const teacherDoesSubjectRepository = new TeacherDoesSubjectRepository();

class AdminController {
    dashboard = async (req, res) => {
        const allSubjects = await subjectRepository.getAllNames();
        res.render("adminDashboard", {
            userData: req.userData,
            subjects: allSubjects,
        });
    };

    addStudent = async (req, res) => {
        const { id, firstName, lastName } = req.body;

        try {
            const student = await studentRepository.create({
                id,
                firstName,
                lastName,
                registrationYear: new Date().getFullYear(),
                password: bcrypt.hashSync("12345678"),
                email: `${id}@mail.ntua.gr`,
            });

            const cardanoRepository = req.app.get("cardanoRepository");
            await cardanoRepository.registerStudent(id);
            res.status(200).json({
                message: "Student added successfully",
                student,
            });
        } catch (error) {
            res.status(500).json({ error: "Failed to add student" });
        }
    };

    addTeacher = async (req, res) => {
        const { firstName, lastName, email, address } = req.body;

        try {
            const teacher = await teacherRepository.create({
                firstName,
                lastName,
                email,
                address,
                password: bcrypt.hashSync("12345678"),
            });
            res.status(200).json({
                message: "Teacher added successfully",
                teacher,
            });
        } catch (error) {
            res.status(500).json({ error: "Failed to add teacher" });
        }
    };

    addSubject = async (req, res) => {
        const { name, semester, teacherId } = req.body;

        try {
            const teacher = await teacherRepository.findOne(teacherId);
            if (!teacher) {
                return res.status(404).json({ error: "Teacher not found" });
            }
            const cardanoRepository = req.app.get("cardanoRepository");
            const token = await cardanoRepository.deploySubject(
                name,
                teacher.address,
            );
            const subject = await subjectRepository.create({
                name,
                semester,
                token,
            });

            await teacherDoesSubjectRepository.create({
                teacherId,
                subjectId: subject.id,
                startDate: new Date(),
            });

            res.status(200).json({
                message: "Subject added successfully",
                subject,
            });
        } catch (error) {
            res.status(500).json({ error: "Failed to add subject" });
        }
    };

    updateSubject = async (req, res) => {
        const data = req.body;

        try {
            if (!data.subjectId) {
                return res.status(400).json({ error: "Missing subjectId" });
            }

            if (data.teacherId) {
                const newTeacher = await teacherRepository.findOne(
                    data.teacherId,
                );
                if (!newTeacher) {
                    return res.status(404).json({ error: "Teacher not found" });
                }

                await teacherDoesSubjectRepository.changeTeacher(
                    data.teacherId,
                    data.subjectId,
                );

                const cardanoRepository = req.app.get("cardanoRepository");
                const subject = await subjectRepository.getGToken({
                    id: data.subjectId,
                });

                await cardanoRepository.updateSubject(subject, {
                    teacher: newTeacher.address,
                });
            }

            if (data.semester) {
                await subjectRepository.update(data.subjectId, {
                    semester: data.semester,
                });
            }

            res.status(200).json({ message: "Subject updated successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to update subject" });
        }
    };

    changeDegreeSubjects = async (req, res) => {
        const { subjectIds } = req.body;
        try {
            const newPolicies = [];

            for (const subjectId of subjectIds) {
                const gToken = await subjectRepository.getGToken({
                    id: subjectId,
                });
                newPolicies.push(gToken);
            }

            const cardanoRepository = req.app.get("cardanoRepository");
            await cardanoRepository.updatePolicies(newPolicies);
            res.status(200).json({
                message: "Degree subjects updated successfully",
            });
        } catch (error) {
            res.status(500).json({ error: "Failed to update degree subjects" });
        }
    };

    startRegistartion = async (req, res) => {
        let register_until = req.body.closeRegistrationDate;

        try {
            register_until = new Date(register_until);
        } catch (error) {
            return res.render("error", { error: "Invalid date" });
        }

        const twoMonthsInMilliseconds = 2 * 30 * 24 * 60 * 60 * 1000;

        const now = new Date();
        const month = now.getMonth();
        let mod;

        // Registrations should be updated between September and October for Odd semesters
        // Registrations should be updated between January and March for Even semesters
        if (month >= 8 && month <= 9) {
            mod = 1;
        } else if (month >= 0 && month <= 2) {
            mod = 0;
        } else {
            return res.render("error", {
                error: "Not valid registration period",
            });
        }

        if (now >= register_until) {
            return res.render("error", {
                error: "Registration date must be in the future",
            });
        }
        if (
            now.getTime() + twoMonthsInMilliseconds <
            register_until.getTime()
        ) {
            return res.render("error", {
                error: "Registration date must be at most 2 months in the future",
            });
        }

        try {
            let bulk = [];
            const cardanoRepository = req.app.get("cardanoRepository");

            const subjects = await subjectRepository.findAll();

            for (const subject of subjects) {
                if (subject.semester % 2 == mod) {
                    bulk.push({
                        sName: subject.name,
                        gToken: JSON.parse(atob(subject.token)),
                    });
                    if (bulk.length == 5) {
                        await cardanoRepository.updateRegisterUntil(
                            bulk,
                            register_until,
                        );
                        bulk = [];
                    }
                }
            }
            if (bulk.length != 0) {
                await cardanoRepository.updateRegisterUntil(
                    bulk,
                    register_until,
                );
            }

            res.redirect("/");
        } catch (error) {
            console.log(error);
            return res.render("error", {
                error: "Failed to update registration date",
            });
        }
    };
}

export default AdminController;
