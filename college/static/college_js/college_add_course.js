const validate = () => {

    const course_name = document.querySelector('#course_name').value.trim();
    const course_duration = document.querySelector('#course_duration').value.trim();

    const course_name_error = document.querySelector('#course_name_error');
    const course_duration_error = document.querySelector('#course_duration_error');

    let valid = true;


    if (course_name === "") {
        course_name_error.textContent = "Please Enter Course Name";
        course_name_error.className = "text-danger fw-bold";

        valid = false;
    } else {
        course_name_error.textContent = "";
    }


    if (course_duration === "") {
        course_duration_error.textContent = "Please Enter Course Duration";
        course_duration_error.className = "text-danger fw-bold";

        valid = false;
    } else {
        course_duration_error.textContent = "";
    }


    return valid;
};

