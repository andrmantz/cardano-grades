import bcrypt from "bcryptjs";

import db from "../models/index.js";

class TeacherRepository {
    async create(data) {
        return db.Teacher.create(data);
    }

    async update(id, data) {
        const record = await db.Teacher.findOne(id);
        if (!record) {
            throw new Error("Not found");
        }
        return record.update(data);
    }

    async findAll(filter = {}) {
        return db.Teacher.findAll({ where: filter });
    }

    async findOne(id) {
        return db.Teacher.findByPk(id);
    }

    async findOneByEmail(email) {
        const teacher = await db.Teacher.findOne({
            where: {
                email: email,
            },
        });

        if (!teacher) {
            return false;
        }

        return teacher;
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
            throw new Error("Not found");
        }
        return record.destroy();
    }
}

export default TeacherRepository;
