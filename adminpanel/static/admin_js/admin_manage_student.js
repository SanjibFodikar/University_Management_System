// Get Course
document.getElementById('college').addEventListener('change', () => {
    const college_id = document.getElementById('college').value;
    const courseSelect = document.getElementById('course');
    const semesterSelect = document.querySelector('#semester')
    const table_row = document.getElementById('studentTable');
    courseSelect.innerHTML = `
            <option value="">Select Course</option>
        `;
    semesterSelect.innerHTML=`<option value="">Select Semester</option>`;
    table_row.innerHTML = "";
    fetch(`/adminpanel/get_course/${college_id}/`)
        .then(a => a.json())
        .then(data => {
            data.courses.forEach(e => {
                courseSelect.innerHTML += `
                        <option value="${e.id}">
                            ${e.course_name__course_name}
                        </option>

                    `;
            });

        });

});

// add course data
document.getElementById('course').addEventListener('change', () => {

    const college_id = document.getElementById('college').value;
    const course_id = document.getElementById('course').value;
    const semesterSelect = document.querySelector('#semester')
    const table_row = document.getElementById('studentTable');
    
    semesterSelect.innerHTML=`<option value="">Select Semester</option>`
    
    table_row.innerHTML = "";

    if (!college_id) {
        return;
    }

    // fetch function to get related semester
    fetch(`/adminpanel/get_studentSemester/${college_id}/${course_id}/`)
    .then(a=>a.json())
    .then(data=>{
        data.forEach(e=>{
            semesterSelect.innerHTML+=`<option id="semester_${e.semester__id}" value="${e.semester__id}">${e.semester__semester}</option>`
        });
    })
    .catch(error => {
        console.error("Semester Error:", error);
    });

    // fecth function to get student details
    fetch(`/adminpanel/get_studentData/${college_id}/${course_id}/`)

        .then(response => response.json())

        .then(data => {

            if (data.length === 0) {

                table_row.innerHTML = `
                    <tr>
                        <td colspan="15" class="text-center">
                            No students found
                        </td>
                    </tr>
                `;

                return;
            }

            data.forEach((e, index) => {

                table_row.innerHTML += `

                    <tr>
                        <td>${index + 1}</td>

                        <td>${e.name}</td>

                        <td>${e.user__email}</td>

                        <td>${e.mobile}</td>

                        <td>${e.dob}</td>

                        <td>${e.college_course__college__college_name}</td>

                        <td>${e.college_course__course_name__course_name}</td>

                        <td>
                            ${e.semester__year || ''}
                            -
                            ${e.semester__semester || ''}
                        </td>

                        <td>${e.admission_date}</td>

                        <td>${e.course_end_date}</td>

                        <td id="roll-number-${e.id}">${e.roll_number}</td>

                        <td id="registration-number-${e.id}">${e.registration_number}</td>

                        <td>

                            ${e.college_verify

                        ? `<span class="badge bg-success">
                                    Verified
                                   </span>`

                        : `<span class="badge bg-warning text-dark">
                                    Pending
                                   </span>`
                    }

                        </td>

                        <td id="university_verify-${e.id}">

                            ${e.university_verify

                        ? `<span class="badge bg-success">
                          Approved
                        </span>`

                        : (e.roll_number && e.registration_number)

                            ? `<span class="badge bg-danger">
                            Reject
                            </span>`

                            : `<span class="badge bg-warning text-dark">
                            Pending
                            </span>`
                        }

                        </td>

                        <td>

                            ${e.is_active

                        ? `<span class="badge bg-success">
                                    Active
                                   </span>`

                        : `<span class="badge bg-danger">
                                    Inactive
                                   </span>`
                    }

                        </td>

                        <td>
                             ${e.university_verify && e.is_active

                        ? `<button type="button"
                                class="btn btn-danger reject-btn"
                                data-id="${e.id}">
                                Reject
                                </button>`

                        : e.is_active

                         ? `<button type="button"
                           class="btn btn-success approved-btn"
                          data-id="${e.id}">
                          Approved
                        </button>`

                        : `<button type="button"
                        class="btn btn-secondary approved-btn"
                         data-id="${e.id}"
                         data-is-active="${e.is_active}">
                         Approved
                        </button>`
                        }
                        </td>

                    </tr>

                `;

            });

        })

        .catch(error => {

            console.error("Error:", error);

            table_row.innerHTML = `
                <tr>
                    <td colspan="15" class="text-center text-danger">
                        Error loading student data
                    </td>
                </tr>
            `;

        });

});

// add semester to get that specific semester result
document.getElementById('semester').addEventListener('change', () => {

    const college_id = document.getElementById('college').value;
    const course_id = document.getElementById('course').value;
    const semester_id = document.getElementById('semester').value;

    const table_row = document.getElementById('studentTable');

    if (!college_id) {
        alert('Please Select College First.');
        return;
    }

    if (!course_id) {
        alert('Please Select Course First.');
        return;
    }

    if (!semester_id) {
        return;
    }

    table_row.innerHTML = "";

    fetch(`/adminpanel/get_studentData/${college_id}/${course_id}/${semester_id}/`)

        .then(response => response.json())

        .then(data => {

            console.log(data);

            if (data.length === 0) {

                table_row.innerHTML = `
                    <tr>
                        <td colspan="16" class="text-center">
                            No students found
                        </td>
                    </tr>
                `;

                return;
            }

            data.forEach((e, index) => {

                table_row.innerHTML += `

                    <tr>

                        <td>${index + 1}</td>
                        <td>${e.name}</td>
                        <td>${e.user__email}</td>
                        <td>${e.mobile}</td>
                        <td>${e.dob}</td>

                        <td>
                            ${e.college_course__college__college_name}
                        </td>

                        <td>
                            ${e.college_course__course_name__course_name}
                        </td>

                        <td>
                            ${e.semester__year || ''}
                            -
                            ${e.semester__semester || ''}
                        </td>

                        <td>${e.admission_date}</td>

                        <td>${e.course_end_date}</td>

                        <td id="roll-number-${e.id}">
                            ${e.roll_number || ''}
                        </td>

                        <td id="registration-number-${e.id}">
                            ${e.registration_number || ''}
                        </td>

                        <td>

                            ${e.college_verify

                                ? `<span class="badge bg-success">
                                    Verified
                                   </span>`

                                : `<span class="badge bg-warning text-dark">
                                    Pending
                                   </span>`
                            }

                        </td>

                        <td id="university_verify-${e.id}">

                            ${e.university_verify

                        ? `<span class="badge bg-success">
                          Approved
                        </span>`

                        : (e.roll_number && e.registration_number)

                            ? `<span class="badge bg-danger">
                            Reject
                            </span>`

                            : `<span class="badge bg-warning text-dark">
                            Pending
                            </span>`
                        }

                        </td>

                        <td>

                            ${e.is_active

                                ? `<span class="badge bg-success">
                                    Active
                                   </span>`

                                : `<span class="badge bg-danger">
                                    Inactive
                                   </span>`
                            }

                        </td>

                        <td>

                            ${e.university_verify && e.is_active

                        ? `<button type="button"
                                class="btn btn-danger reject-btn"
                                data-id="${e.id}">
                                Reject
                                </button>`

                        : e.is_active

                         ? `<button type="button"
                           class="btn btn-success approved-btn"
                          data-id="${e.id}">
                          Approved
                        </button>`

                        : `<button type="button"
                        class="btn btn-secondary approved-btn"
                         data-id="${e.id}"
                         data-is-active="${e.is_active}">
                         Approved
                        </button>`
                        }

                        </td>

                    </tr>

                `;

            });

        })

        .catch(error => {

            console.error("Error:", error);

            table_row.innerHTML = `
                <tr>
                    <td colspan="16" class="text-center text-danger">
                        Error loading student data
                    </td>
                </tr>
            `;

        });

});

// approved student reject student
document.getElementById('studentTable').addEventListener('click', (event) => {
    console.log(event)
    const approveBtn = event.target.closest('.approved-btn');
    const rejectBtn = event.target.closest('.reject-btn')
    if (rejectBtn) {
        const student_reject_id = rejectBtn.dataset.id;
        fetch(`/adminpanel/admin_approved_student/${student_reject_id}/?action=reject`)
        .then(a=>a.json())
        .then(data=>{
            const student = data[0];

            document.getElementById(
                `university_verify-${student_reject_id}`
            ).innerHTML = `
                <span class="badge bg-danger">
                    Rejected
                </span>
            `;

            rejectBtn.outerHTML = `
                <button type="button"
                        class="btn btn-success approved-btn"
                        data-id="${student_reject_id}">
                    Approved
                </button>
            `;
        })
        return
    }

    const is_active = approveBtn.dataset.isActive;

    if (is_active === "false") {

    alert("This student has not been longer with college and university.");

    return;
    }

    if (!approveBtn) {
    return;
    }

    const student_id = approveBtn.dataset.id;

    fetch(`/adminpanel/admin_approved_student/${student_id}/`)

        .then(response => response.json())

        .then(data => {
            const student = data[0];
            console.log(student)
            console.log(student.university_verify)
            document.getElementById(
                `roll-number-${student_id}`
            ).innerText = student.roll_number;

            document.getElementById(
                `registration-number-${student_id}`
            ).innerText = student.registration_number;

            document.getElementById(
                `university_verify-${student_id}`
            ).innerHTML = `
                <span class="badge bg-success">
                    Approved
                </span>
            `;

            approveBtn.outerHTML = `
                <button type="button"
                        class="btn btn-danger reject-btn"
                        data-id="${student_id}">
                    Reject
                </button>
            `;

        })

        .catch(error => {
            console.error("Error:", error);
        });

});

// search student
document.getElementById('searchStudent').addEventListener('input',(e)=>{
    const searchValue=document.getElementById('searchStudent').value.toLowerCase();
    const table_value=document.getElementById('studentTable')
    const table_row=table_value.querySelectorAll('tr')
    table_row.forEach((row)=>{
        let rowValue=row.innerText.toLowerCase();
        if (rowValue.includes(searchValue)) {
            row.style.display=""
        }else{
            row.style.display="none"
        }
    });
});

