import Chance from "chance";
import bcrypt from "bcryptjs";

import db from "../models/index.js";
import SubjectRepository from "../database/subjectRepository.js";
import {
    addresses,
    subs,
    getTeacherFromCounter,
    pickGradesFromCounter,
} from "./seedUtils.js";

const chance = new Chance();

const createFakeTeachers = () => {
    let teachers = [];
    const hash = bcrypt.hashSync("12345678");


    for (let i = 0; i < 10; i++) {
        teachers.push({
            id: i,
            firstName: chance.first(),
            lastName: chance.last(),
            email: i === 0 ? "secreta@ntua.gr" : `teacher${i}@mail.ntua.gr`,
            password: hash,
            address: i === 0 ? process.env.ADMINISTRATOR_ADDRESS : addresses[i - 1],
        });
    }

    return teachers;
};

const createFakeStudents = () => {
    let students = [];
    const hash = bcrypt.hashSync("12345678");

    for (let i = 21; i < 24; i++) {
        for (let j = 1; j < 6; j++) {
            const studentId = `el${i}00${j}`;
            students.push({
                firstName: chance.first(),
                lastName: chance.last(),
                id: studentId,
                registrationYear: `20${i}`,
                password: hash,
                email: `${studentId}@mail.ntua.gr`,
                proofspaceId: null,
            });
        }
    }

    return students;
};

const createFakeSubjects = () => {
    let subjects = [];

    for (let s = 0; s < subs.length; s++) {
        subjects.push({
            name: subs[s][0],
            semester: subs[s][1],
        });
    }

    return subjects;
};

const createTeacherDoesSubject = () => {
    let teacherDoesSubjects = [];
    let subjectId = 1;

    for (let teacherId = 1; teacherId <= 8; teacherId++) {
        let numSubjects;

        if (teacherId === 1 || teacherId === 2) {
            numSubjects = 4;
        } else if (teacherId === 3 || teacherId === 4) {
            numSubjects = 3;
        } else if (teacherId === 5 || teacherId === 6) {
            numSubjects = 2;
        } else {
            numSubjects = 1;
        }
        for (let i = 0; i < numSubjects; i++) {
            if (subjectId <= 20) {
                teacherDoesSubjects.push({
                    startDate: new Date(2010, 0, 1),
                    teacherId,
                    subjectId,
                });
                subjectId++;
            }
        }
    }

    return teacherDoesSubjects;
};

const initLocalChain = async (cardanoRepository) => {
    const vUnit = await cardanoRepository.initPolicyContract();
    let counter = 0;

    const gradeTokens = [];
    for (const sub of subs) {
        const address = addresses[getTeacherFromCounter(counter)];
        const grades = pickGradesFromCounter(counter);

        const gToken = await cardanoRepository.deploySubject(
            sub[0],
            address,
            grades[0],
            grades[1],
        );
        gradeTokens.push({
            sName: sub[0],
            gToken,
        });
        counter++;
    }

    await cardanoRepository.updatePolicies(gradeTokens);

    // Add tokens into db
    const sRepo = new SubjectRepository();
    await sRepo.massAddTokens(gradeTokens);

    for (let i = 21; i < 24; i++) {
        for (let j = 1; j < 6; j++) {
            const id = `el${i}00${j}`;
            await cardanoRepository.registerStudent(id);
            if (i == 23) {
                await cardanoRepository.registerSubjects(gradeTokens.slice(0, 4), id, "1");
            }
        }
    }
};

const fillTables = async (cardanoRepository) => {
    await db.sequelize.sync();
    await db.Teacher.bulkCreate(createFakeTeachers());
    await db.Student.bulkCreate(createFakeStudents());
    await db.Subject.bulkCreate(createFakeSubjects());
    await db.TeacherDoesSubject.bulkCreate(createTeacherDoesSubject());
    await initLocalChain(cardanoRepository);
};

export default fillTables;
