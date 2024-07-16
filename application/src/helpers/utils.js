export const yearToSemester = (registrationYear, secondDate) => {
    const startDate = new Date(registrationYear, 8);
    const endDate = new Date(secondDate);
    if (endDate < startDate) {
        return 0;
    }

    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    if (yearDiff === 0) {
        return 1;
    }

    let currentSemesterInYear;
    if (endDate.getMonth() >= 8) {
        currentSemesterInYear = 1;
    } else if (endDate.getMonth() <= 7) {
        currentSemesterInYear = 2;
    }

    return (yearDiff - 1) * 2 + currentSemesterInYear;
};

export const currentSemester = (registrationYear) => {
    const today = new Date();
    return yearToSemester(registrationYear, today);
};
