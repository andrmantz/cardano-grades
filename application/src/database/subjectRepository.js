import db from "../models/index.js";

class SubjectRepository {
    async create(data) {
        return db.Subject.create(data);
    }

    async findAll(filter = {}) {
        return db.Subject.findAll({ where: filter });
    }

    async findOne(id) {
        return db.Subject.findByPk(id);
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

    getAllNames = async () => {
        try {
            const subjects = await db.Subject.findAll({
                attributes: ["id", "name"],
            });

            const subjectMap = subjects.reduce((acc, subject) => {
                acc[subject.id] = subject.name;
                return acc;
            }, {});

            return subjectMap;
        } catch (error) {
            console.error("Error fetching subjects:", error);
            throw error;
        }
    };

    getSubjectsBySemesterType = async (currentSemester) => {
        try {
            const subjects = await db.Subject.findAll({
                attributes: ["name", "semester"],
                where: {
                    semester: {
                        [db.Sequelize.Op.lte]: currentSemester,
                    },
                },
                order: [["semester", "ASC"]],
            });

            const grouped = subjects.reduce((acc, subject) => {
                const semester = subject.semester;
                const subjectName = subject.name;

                if (!acc[semester]) {
                    acc[semester] = [];
                }
                acc[semester].push(subjectName);

                return acc;
            }, {});

            return grouped;
        } catch (error) {
            throw error;
        }
    };

    massAddTokens = async (data) => {
        try {
            for (const item of data) {
                const b64token = btoa(JSON.stringify(item.gToken));
                await db.Subject.update(
                    { token: b64token },
                    { where: { name: item.sName } },
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    getSubjectsGroupedBySemester = async () => {
        try {
            const subjects = await db.Subject.findAll();

            const grouped = subjects.reduce((acc, subject) => {
                const semester = subject.semester;
                const subjectName = subject.name;

                if (!acc[semester]) {
                    acc[semester] = [];
                }
                acc[semester].push(subjectName);

                return acc;
            }, {});

            return grouped;
        } catch (error) {
            throw error;
        }
    };

    getGToken = async (data) => {
        try {
            let subject;
            if (data.id) {
                subject = await db.Subject.findOne({ where: { id: data.id } });
            } else if (data.name) {
                subject = await db.Subject.findOne({
                    where: { name: data.name },
                });
            } else {
                throw new Error("Missing parameters");
            }

            return {
                sName: subject.name,
                gToken: JSON.parse(atob(subject.token)),
            };
        } catch (error) {
            throw error;
        }
    };
}

export default SubjectRepository;
