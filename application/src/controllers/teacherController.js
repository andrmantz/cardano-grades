import TeacherRepository from "../database/teacherRepository.js";
import TeacherDoesSubjectRepository from "../database/teacherDoesSubjectRepository.js";
import SubjectRepository from "../database/subjectRepository.js";
import StudentRepository from "../database/studentRepository.js";
import Proofspace from "../database/proofspaceRepository.js";

import { toText } from "lucid-cardano";

const teacherRepository = new TeacherRepository();
const teacherDoesSubjectRepository = new TeacherDoesSubjectRepository();
const subjectRepository = new SubjectRepository();
const studentRepository = new StudentRepository();
const proofspace = new Proofspace();

class TeacherController {
    dashboard = async (req, res) => {
        const subjects =
            await teacherDoesSubjectRepository.getSubjectsForTeacher(
                req.userData.id,
            );
        res.render("teacherDashboard", {
            userData: req.userData,
            subjects: subjects,
        });
    };

    getRegisteredStudents = async (req, res) => {
        const subjectId = req.params.subjectId;

        const cardanoRepository = req.app.get("cardanoRepository");

        const subject = await subjectRepository.findOne(subjectId);
        const teacher = await teacherDoesSubjectRepository.teacherForSubject(subjectId);

        if (!subject || !teacher || teacher.length !== 1)
            return res.render("error", { error: "Subject does not exist" });

        if (teacher[0].teachers.id !== req.userData.id) {
            return res.render("error", { error: "Not the teacher of this subject." });
        }

        const gToken = {
            sName: subject.name,
            gToken: JSON.parse(atob(subject.token)),
        };

        const subjectDetails =
            await cardanoRepository.getSubjectDetails(gToken);

        const registeredIds = subjectDetails.registrations.map((registration) =>
            toText(registration),
        );

        const month = new Date().getMonth();

        if (subjectDetails.reset) {
            if (month < 8 || month > 12) {
                return res.render("error", { error: "Grades already confirmed." });
            }
        }
        else {
            if (subject.semester % 2 == 1) {
                if (month < 1 || month > 5) {
                    return res.render("error", { error: "No grading period" });
                }
            } else {
                if (month < 5 || month > 8) {
                    return res.render("error", { error: "No grading period" });
                }
            }
        }
        const students = await studentRepository.bulkGetStudentsById(registeredIds);
        const studentData = students.map((student) => {
            return {
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
            }
        });

        res.render("addGrade", {
            userData: req.userData,
            sName: gToken.sName,
            studentData: studentData,
        });
    };

    getTeacherInfo = async (req, res) => {
        const info = await teacherRepository.findOne(req.userData.id);
        res.render("teacherInfo", {
            userData: req.userData,
            teacherInfo: info,
        });
    };

    updateTeacherInfo = async (req, res) => {
        const data = req.body;
        if (Object.keys(data).length === 0)
            return res.render("error", { error: "Missing parameters" });

        const keys = Object.keys(data);
        if (!keys.includes("email") || !keys.includes("password"))
            res.render("error", {
                error: "Only email and password can be edited",
            });

        Object.keys(data).forEach((key) => {
            if (
                data[key] === "" ||
                data[key] === null ||
                data[key] === undefined
            ) {
                delete data[key];
            }
        });

        try {
            const studentUpdated = await teacherRepository.update(
                req.userData.id,
                data,
            );
            if (!studentUpdated)
                return res.render("error", {
                    error: "Could not update teacher",
                });
        } catch (error) {
            return res.render("error", { error: "Could not update teacher" });
        }

        this.getTeacherInfo(req, res);
    };


    addGrade = async (req, res) => {
        const subjectId = req.params.subjectId;
        const students = req.body.students;

        try {

            const subject = await subjectRepository.findOne(subjectId);
            const teacher = await teacherDoesSubjectRepository.teacherForSubject(subjectId);

            if (!subject || !teacher || teacher.length !== 1)
                return res.render("error", { error: "Subject does not exist" });

            if (teacher[0].teachers.id !== req.userData.id) {
                return res.render("error", { error: "Not the teacher of this subject." });
            }

            const gToken = {
                sName: subject.name,
                gToken: JSON.parse(atob(subject.token)),
            };

            const sIds = [];
            const grades = [];
            const ps = [];

            for (const student of students) {
                const studentInfo = await studentRepository.findOne(student.dataId);
                if (!studentInfo) {
                    return res.render("error", { error: "Student does not exist" });
                }
                if (!student.value) {
                    continue;
                }

                else if (Number(student.value) < 0 || Number(student.value) > 10) {
                    return res.render("error", { error: "Invalid grade" });

                } else {
                    if (Number(student.value) >= 5) {
                        sIds.push(student.dataId);
                        grades.push(Number(student.value));
                    }
                    if (studentInfo.proofspaceId) {
                        ps.push({
                            did: studentInfo.proofspaceId,
                            grade: student.value,
                        });
                    }
                }
            }

            const cardanoRepository = req.app.get("cardanoRepository");

            if (grades.length !== 0) {
                cardanoRepository.pickTeacher(teacher[0].teachers.address);
                await cardanoRepository.grade(sIds, grades, gToken);
                cardanoRepository.reset();
            }

            if (ps.length !== 0) {
                await proofspace.issueGradesCredentials(ps, subject.name);
            }
            res.redirect("/");
        } catch (error) {
            console.log(error);
        }

    };
}

export default TeacherController;
