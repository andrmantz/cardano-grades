import StudentRepository from "../database/studentRepository.js";
import SubjectRepository from "../database/subjectRepository.js";
import Proofspace from "../database/proofspaceRepository.js";

import { currentSemester } from "../helpers/utils.js";

const studentRepository = new StudentRepository();
const subjectRepository = new SubjectRepository();
const proofspace = new Proofspace();

class StudentController {
    dashboard = async (req, res) => {
        const studentData = await studentRepository.findOne(req.userData.id);

        if (!studentData.proofspaceId) {
            const pid = "JRpxFRCH84RrQcptCzF3PN";
            await studentRepository.update(req.userData.id, {
                proofspaceId: pid
            });
            await proofspace.issueUniCredential(pid, req.userData.id, "ECE NTUA");
            return res.render("proofspace", { userData: req.userData });
        }

        const subjects = await subjectRepository.getSubjectsGroupedBySemester();
        const cardanoRepository = req.app.get("cardanoRepository");
        const grades_ = await cardanoRepository.getGrades(req.userData.id);

        const grades = {};

        for (const semester in subjects) {
            const filteredSubjects = subjects[semester]
                .filter((subject) => grades_[subject] !== undefined)
                .map((subject) => ({
                    subject: subject,
                    grade: Number(grades_[subject]),
                }));


            if (filteredSubjects.length > 0) {
                grades[Number(semester)] = filteredSubjects;
            }
        }

        const showClaimDegree =
            grades_["degree"] || false;

        res.render("studentDashboard", {
            userData: req.userData,
            grades: grades,
            showClaimDegree: showClaimDegree,
        });
    };

    getAvailableSubjects = async (req, res) => {
        const student = await studentRepository.findOne(req.userData.id);
        const currSemester = currentSemester(student.registrationYear);

        const allSubjects =
            await subjectRepository.getSubjectsBySemesterType(currSemester);

        const cardanoRepository = req.app.get("cardanoRepository");

        const alreadyRegistered = await cardanoRepository.isRegistered(
            req.userData.id,
            String(currSemester),
        );

        if (alreadyRegistered) {
            return res.render("error", { error: "Already registered." });
        }

        const gToken = await subjectRepository.getGToken({
            name: allSubjects[currSemester][0],
        });
        const subjectDetails =
            await cardanoRepository.getSubjectDetails(gToken);

        if (subjectDetails.register_until < Date.now()) {
            return res.render("error", { error: "Registrations closed" });
        }

        const passedSubjects = await cardanoRepository.passedSubjects(
            req.userData.id,
        );

        const subjects = {};

        for (const semester in allSubjects) {
            if (Number(semester) % 2 !== currSemester % 2) {
                continue;
            }
            subjects[Number(semester)] = allSubjects[semester].filter(
                (subject) => !passedSubjects.has(subject),
            );

            if (subjects[Number(semester)].length === 0) {
                delete subjects[semester];
            }
        }

        res.render("studentSubjects", {
            userData: req.userData,
            subjects: subjects,
        });
    };

    getStudentInfo = async (req, res) => {
        const info = await studentRepository.findOne(req.userData.id);
        res.render("studentInfo", {
            userData: req.userData,
            studentInfo: info,
        });
    };

    updateStudentInfo = async (req, res) => {
        const data = req.body;
        if (Object.keys(data).length === 0) {
            return this.renderError(res, "Missing parameters");
        }

        const keys = Object.keys(data);
        if (!keys.includes("email") || !keys.includes("password")) {
            return this.renderError(
                res,
                "Only email and password can be edited",
            );
        }

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
            const studentUpdated = await studentRepository.update(
                req.userData.id,
                data,
            );
            if (!studentUpdated) {
                return this.renderError(res, "Could not update student");
            }
        } catch (error) {
            return this.renderError(res, "Could not update student");
        }

        this.getStudentInfo(req, res);
    };

    registerSemester = async (req, res) => {
        const subjects = req.body.subjects;
        const gTokens = [];

        try {
            const cardanoRepository = req.app.get("cardanoRepository");

            const passedSubjects = await cardanoRepository.passedSubjects(
                req.userData.id,
            );

            for (const subject of subjects) {

                if (passedSubjects.has(subject)) {
                    return res.render("error", {
                        error: "You are already registered for this subject",
                    });
                }

                const gToken = await subjectRepository.getGToken({
                    name: subject,
                });
                gTokens.push(gToken);
            }

            const student = await studentRepository.findOne(req.userData.id);

            const currSemester = String(currentSemester(student.registrationYear));
            const alreadyRegistered = await cardanoRepository.isRegistered(
                req.userData.id,
                currSemester,
            );

            if (alreadyRegistered) {
                return res.render("error", { error: "Already registered" });
            };

            await cardanoRepository.registerSubjects(
                gTokens,
                req.userData.id,
                currSemester,
            );

            await proofspace.issueRegistrationCredentials(student.proofspaceId, subjects, currSemester);

            res.redirect("/");
        } catch (error) {
            console.log(error);
            this.renderError(res, "Could not register semester");
        }
    };

    mintDegree = async (req, res) => {
        const studentAddress = req.body.studentAddress;

        try {
            const cardanoRepository = req.app.get("cardanoRepository");

            const student = await studentRepository.findOne(req.userData.id);

            const grades = await cardanoRepository.getGrades(req.userData.id);

            if (!grades["degree"]) {
                return this.renderError(res, "Degree minting not possible.");
            }

            delete grades["degree"];

            let sum = 0;
            let count = 0;
            for (const subject in grades) {
                sum += Number(grades[subject]);
                count++;

            }

            const average = String((sum / count).toFixed(2));

            await cardanoRepository.mintDegree(req.userData.id, studentAddress, average);
            await proofspace.issueDegreeCredential(student.proofspaceId, "ECE NTUA", average);

            res.redirect("/");
        } catch (error) {
            console.log(error);
            this.renderError(res, "Could not mint degree");
        }
    };

    renderError(res, errorMessage) {
        return res.render("error", { error: errorMessage });
    }
}
export default StudentController;
