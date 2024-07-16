const model = (sequelize, Sequelize) => {
    const Subject = sequelize.define("Subject", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        semester: {
            type: Sequelize.INTEGER,
        },
        token: {
            type: Sequelize.STRING,
        },
    });

    return Subject;
};

export default model;
