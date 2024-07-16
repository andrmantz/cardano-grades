const changeSubjects = async () => {
    const selectedSubjects = [];
    const checkboxes = document.querySelectorAll(
        'input[type="checkbox"]:checked',
    );

    checkboxes.forEach((checkbox) => {
        selectedSubjects.push(checkbox.id);
    });

    await fetch("/admin/changeSubjects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            subjectIds: selectedSubjects,
        }),
    });

    window.location.pathname = "/";
};

window.onload = () => {
    document
        .getElementById("changeBtn")
        .addEventListener("click", changeSubjects);
};
