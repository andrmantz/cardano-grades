import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import db from "../models/index.js";

class StudentRepository {
    async create(data) {
        return db.Student.create(data);
    }

    async findAll(filter = {}) {
        return db.Student.findAll({ where: filter });
    }

    async findOne(id) {
        return db.Student.findByPk(id, {
            attributes: [
                "id",
                "email",
                "firstName",
                "lastName",
                "registrationYear",
                "proofspaceId",
            ],
        });
    }

    async findOneByEmail(email) {
        const student = await db.Student.findOne({
            where: {
                email: email,
            },
        });

        if (!student) {
            return false;
        }

        return student;
    }

    async update(id, data) {
        if (Object.keys(data).includes("password"))
            data.password = bcrypt.hashSync(data.password);
        const record = await this.findOne(id);
        if (!record) {
            return false;
        }
        return record.update(data);
    }

    async delete(id) {
        const record = await this.findOne(id);
        if (!record) {
            return false;
        }
        return record.destroy();
    }

    bulkGetStudentsById = async (ids) => {
        try {
            const students = await db.Student.findAll({
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                },
            });

            return students;
        } catch (error) {
            throw error;
        }
    };
}

export default StudentRepository;
