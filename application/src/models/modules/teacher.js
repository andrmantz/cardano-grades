const model = (sequelize, Sequelize) => {
    const Teacher = sequelize.define("Teacher", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.STRING,
        },
    });

    return Teacher;
};

export default model;
