const addresses = [
    "addr_test1vq3u06x3az639mnr9g4u63zpr72awzysddx9chuaz06mjrcu6x377",
    "addr_test1vzyxxdlemy75eszfhv5r5gvymte0xmznk6ytxqn5m0p7nkc6n23tf",
    "addr_test1vq5mn7z05vzvfuxcy54n0zslqsut5q480uazzs8nugefm8sxx2hhq",
    "addr_test1vr2guplt6kts794h3gd7v86cjhzm9qsfud4taldp8qjh0rqp0wv0g",
    "addr_test1vrj9s7kfgh45rjt3t8zkqwpv5ghuc08qk4ly48ja08vkcmqheh9g6",
    "addr_test1vqaphknrp0duul7ux2hpyu5jvkwvf3v0lzf2yfkjncz7hhsumlv7a",
    "addr_test1vrx9fr5vle5nzaxc28nyst9q0paz9de6xtzntj2t640g4ecf287wa",
    "addr_test1vrhf0z5ykx57yrnj0c8ylurxpgmfqyztc8xk78hszyptvaq58t06w",
    "addr_test1vpnx32u9jz50m4sgte8k75gml7esp36g65tqnnzyh3rd7wqpjj24n",
];

const subs = [
    ["Electrical Engineering", "1"],
    ["Computer Programming", "1"],
    ["Engineering Physics", "1"],
    ["Maths", "1"],
    ["Circuit Analysis", "2"],
    ["Data Structures", "2"],
    ["Logic Design", "2"],
    ["Linear Algebra", "2"],
    ["Electronics", "3"],
    ["Comp Architecture", "3"],
    ["Digital Design", "3"],
    ["Embedded Systems", "4"],
    ["Signals & Systems", "4"],
    ["Control Systems", "4"],
    ["Microcontrollers", "5"],
    ["Robotics Basics", "5"],
    ["Technical Writing", "5"],
    ["Electromagnetics", "6"],
    ["Algorithm Design", "6"],
    ["Sustainable Engineering", "6"],
];

const getTeacherFromCounter = (counter) => {
    if (counter < 4) {
        return 0;
    } else if (counter < 8) {
        return 1;
    } else if (counter < 11) {
        return 2;
    } else if (counter < 14) {
        return 3;
    } else if (counter < 16) {
        return 4;
    } else if (counter < 18) {
        return 5;
    } else if (counter < 19) {
        return 6;
    } else {
        return 7;
    }
};

const pickGradesFromCounter = (counter) => {
    const s2 = ["el21001", "el21002", "el21003", "el21004", "el21005"];
    const s1 = ["el22001", "el22002", "el22003", "el22004", "el22005", ...s2];

    const students = [];
    const grades = [];

    if (counter < 8) {
        const numGrades = Math.floor(Math.random() * s1.length);

        for (let _ = 0; _ < numGrades; _++) {
            const index = Math.floor(Math.random() * s1.length);
            students.push(s1[index]);
            grades.push(Math.floor(Math.random() * 6) + 5);
        }
    } else if (counter < 14) {
        const numGrades = Math.floor(Math.random() * s2.length);

        for (let _ = 0; _ < numGrades; _++) {
            const index = Math.floor(Math.random() * s2.length);
            students.push(s2[index]);
            grades.push(Math.floor(Math.random() * 6) + 5);
        }
    }

    return [students, grades];
};

export { addresses, subs, getTeacherFromCounter, pickGradesFromCounter };
