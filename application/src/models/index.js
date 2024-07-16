import path from "path";
import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import { dirname } from "path";

import dbConfig from "../config/database.js";
import walk from "../helpers/file.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sequelize = new Sequelize(dbConfig);

const db = {};

(async () => {
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    const models = await walk(path.join(__dirname, "modules"));
    for (const model of models) {
        const modelModule = await import(model.path);
        const handler = modelModule.default;
        const name = model.name.replace(".js", "");
        db[name.substring(0, 1).toUpperCase() + name.substring(1)] = handler(
            sequelize,
            Sequelize,
        );
    }

    db.Teacher.belongsToMany(db.Subject, {
        through: db.TeacherDoesSubject,
        foreignKey: "teacherId",
        otherKey: "subjectId",
        as: "subjects",
    });

    db.Subject.belongsToMany(db.Teacher, {
        through: db.TeacherDoesSubject,
        foreignKey: "subjectId",
        otherKey: "teacherId",
        as: "teachers",
    });

    db.TeacherDoesSubject.belongsTo(db.Teacher, {
        foreignKey: "teacherId",
        as: "teachers",
    });

    db.TeacherDoesSubject.belongsTo(db.Subject, {
        foreignKey: "subjectId",
        as: "subjects",
    });
})();

export default db;
