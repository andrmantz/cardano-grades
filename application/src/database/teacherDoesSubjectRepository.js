import db from "../models/index.js";

class TeacherDoesSubjectRepository {
    async create(data) {
        return db.TeacherDoesSubject.create(data);
    }

    async update(id, data) {
        const record = await db.TeacherDoesSubject.findOne(id);
        if (!record) {
            throw new Error("Not found");
        }
        return record.update(data);
    }

    async findAll(filter = {}) {
        return db.TeacherDoesSubject.findAll({ where: filter });
    }

    async findOne(id) {
        return db.TeacherDoesSubject.findByPk(id);
    }

    async update(id, data) {
        const record = await this.findOne(id);
        if (!record) {
            throw new Error("Not found");
        }
        return record.update(data);
    }

    async delete(id) {
        const record = await this.findOne(id);
        if (!record) {
            throw new Error("Not found");
        }
        return record.destroy();
    }

    teacherForSubject = async (subjectId) => {
        const query = {
            where: {
                subjectId: subjectId,
                endDate: null,
            },
            include: [
                {
                    model: db.Teacher,
                    as: "teachers",
                },
            ],
        };

        const teachers = await db.TeacherDoesSubject.findAll(query);

        return teachers;
    }

    getSubjectsForTeacher = async (teacherId) => {
        const query = {
            where: {
                teacherId: teacherId,
                endDate: null,
            },
            include: [
                {
                    model: db.Subject,
                    as: "subjects",
                    attributes: ["id", "name"],
                },
            ],
            attributes: ["subjectId", "subjects.name"],
        };

        const teacherSubjects = await db.TeacherDoesSubject.findAll(query);

        const subjects = teacherSubjects.map((subject) => {
            return {
                id: subject.subjects.id,
                name: subject.subjects.name,
            };
        });

        return subjects;
    };

    changeTeacher = async (teacherId, subjectId) => {
        try {
            const existingEntry = await db.TeacherDoesSubject.findOne({
                where: {
                    subjectId: subjectId,
                    endDate: null,
                },
            });

            if (existingEntry) {
                await existingEntry.update({ endDate: new Date() });
            }

            await db.TeacherDoesSubject.create({
                teacherId: teacherId,
                subjectId: subjectId,
                startDate: new Date(),
                endDate: null,
            });
        } catch (error) {
            throw error;
        }
    };
}

export default TeacherDoesSubjectRepository;
