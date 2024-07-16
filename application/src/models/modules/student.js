const model = (sequelize, Sequelize) => {
    const Student = sequelize.define("Student", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            unique: true,
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
        registrationYear: {
            type: Sequelize.INTEGER,
        },
        password: {
            type: Sequelize.STRING,
        },
        proofspaceId: {
            type: Sequelize.STRING,
        },
    });

    return Student;
};

export default model;
