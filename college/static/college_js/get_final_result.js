function semester_unique() {
    let semester = document.getElementById('semester');
    console.log(semester)
    let semesterSet = new Set();
    Array.from(semester.options).forEach(option => {

        if (option.value === "") {
            return;
        }
        if (semesterSet.has(option.value)) {
            option.remove();
        } else {
            semesterSet.add(option.value);
        }
    });
}


function course_unique() {

    let course = document.getElementById('course');
    let courseSet = new Set();
    Array.from(course.options).forEach(option => {
        if (option.value === "") {
            return;
        }
        if (courseSet.has(option.value)) {
            option.remove();
        } else {
            courseSet.add(option.value);
        }
    });
}

window.addEventListener("load", () => {
    semester_unique();
    course_unique();
});