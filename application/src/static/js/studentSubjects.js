const registerSubjects = async () => {
    const selectedSubjects = [];
    const checkboxes = document.querySelectorAll(
        'input[type="checkbox"]:checked',
    );

    checkboxes.forEach((checkbox) => {
        selectedSubjects.push(checkbox.id);
    });

    await fetch(window.location.href, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            subjects: selectedSubjects,
        }),
    });

    window.location.pathname = "/";
};

window.onload = () => {
    document
        .getElementById("registerBtn")
        .addEventListener("click", registerSubjects);
};
