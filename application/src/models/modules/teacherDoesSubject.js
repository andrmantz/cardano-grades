const model = (sequelize, Sequelize) => {
    const TeacherDoesSubject = sequelize.define("TeacherDoesSubject", {
        startDate: {
            type: Sequelize.DATE,
        },
        endDate: {
            type: Sequelize.DATE,
        },
    });

    return TeacherDoesSubject;
};

export default model;
