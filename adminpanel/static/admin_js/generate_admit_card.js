document.getElementById('college').addEventListener('change', async (e) => {
    let college_id = e.target.value;
    document.getElementById('course').innerHTML = `<option value="">Select Course</option>`
    document.getElementById('semester').innerHTML = `<option value="">Select Semester</option>`
    let response = await fetch(`/adminpanel/fetch_course_semester_to_generate_admit/${college_id}/`)
    let data = await response.json()
    data.forEach(cs => {
        document.getElementById('course').innerHTML += `
           <option value="${cs.college_course__course_name_id}">
                ${cs.college_course__course_name__course_name}
            </option>
        `;
        document.getElementById('semester').innerHTML += `
           <option value="${cs.semester_id}">
                ${cs.semester__year} - ${cs.semester__semester}
            </option>
        `;

    });
    semester_unique();
})

async function semester_unique() {
    let semester = document.getElementById('semester')
    let semesterSet = new Set()
    Array.from(semester.options).forEach((option) => {
        if (option.value === "") {
            return;
        }
        if (semesterSet.has(option.value)) {
            option.remove()
        } else {
            semesterSet.add(option.value)
        }
    })
}

document.getElementById('Generate_Admit_BTN').addEventListener('click', async (e) => {
    e.preventDefault();

    let college_id = document.getElementById('college').value;
    let course_id = document.getElementById('course').value;
    let semester_id = document.getElementById('semester').value;
    console.log(college_id, course_id, semester_id)
    if (college_id === "" || course_id === "" || semester_id === "") {
        alert("Please Select college,course,semester")
        return;
    }

    formSubmit();
})

async function formSubmit() {

    let form = document.getElementById('Admit_Card_Form');

    let formData = new FormData(form);

    formData.set('admit_btn', '1');

    let response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }

    });

    let data = await response.json();
    if (data.exists) {
        console.log(data.exists)
        showExistingAdmitCard(data);
        return
    }

    let studentData = document.getElementById('admitData');

    let csrfInput = studentData.querySelector('input[name="csrfmiddlewaretoken"]');

    studentData.innerHTML = "";

    if (csrfInput) {
        studentData.appendChild(csrfInput);
    }


    let card1 = document.createElement('div');

    card1.className = "card border-0 shadow-lg rounded-4 overflow-hidden mb-4";

    card1.innerHTML = `

    <input type="hidden" name="course_id" value="${data.course_id}">
    <input type="hidden" name="semester_id" value="${data.semester_id}"> 
    <input type="hidden" name="college_id" value="${data.college_id}">    

        <!-- Subject Card Header -->

        <div class="card-header bg-success text-white p-4">

            <div class="d-flex align-items-center gap-3">

                <div class="bg-white text-success rounded-circle
                            d-flex align-items-center
                            justify-content-center"
                     style="width: 48px; height: 48px;">

                    <i class="bi bi-journal-bookmark-fill fs-4"></i>

                </div>

                <div>

                    <h5 class="mb-1 fw-bold">

                        Subject-wise Examination Details

                    </h5>

                    <small class="text-white-50">

                        Enter written examination date and time

                    </small>

                </div>

            </div>

        </div>


        <!-- Subject Card Body -->

        <div class="card-body p-4 bg-light">


            <!-- Subject Table -->

            <div class="table-responsive bg-white
                        border rounded-4 shadow-sm">

                <table class="table table-bordered
                              table-hover align-middle
                              text-center mb-0">

                    <thead class="table-dark">

                        <tr>

                            <th scope="col">
                                SL No
                            </th>

                            <th scope="col">
                                Paper Code
                            </th>

                            <th scope="col">
                                Paper Name
                            </th>

                            <th scope="col">
                                Examination Date
                            </th>

                            <th scope="col">
                                Time
                            </th>

                        </tr>

                    </thead>


                    <tbody id="subjectRows">

                    </tbody>


                </table>

            </div>


            <!-- Buttons -->

            <div class="d-flex justify-content-center
                        align-items-center mt-4 pb-3
                        flex-wrap gap-2">


                <!-- Apply Once Button -->

                <button type="button" id="GenerateCard"
                        name="GenerateCard"
                        class="btn btn-success">

                    <i class="bi bi-check-circle"></i>

                    Generate Admit Card

                </button>

            </div>


        </div>

    `;


    // =====================================================
    // SUBJECT TABLE ROWS
    // =====================================================

    let subjectRows = card1.querySelector('#subjectRows');

    data.subjects.forEach((subject, subjectIndex) => {

        let subjectRow = document.createElement('tr');

        subjectRow.innerHTML = `

        <!-- SL NO -->

        <td class="fw-bold">

            ${subjectIndex + 1}

            <!-- SUBJECT ID -->

            <input type="hidden" name="subject_id" value="${subject.id}">
                   
        </td>

        <!-- PAPER CODE -->

        <td>

            <strong>${subject.paper_code}</strong>
            <input type="hidden" readonly name="subject_code" value="${subject.paper_code}">
            
        </td>

        <!-- PAPER NAME -->

        <td class="text-start fw-semibold">
            <strong>${subject.subject_name}</strong>
            <input type="hidden" readonly name="subject_name" value="${subject.subject_name}">

        </td>

        <!-- EXAMINATION DATE -->

        <td>
           
            <input type="date" class="form-control" name="exam_date_${subject.id}">

        </td>

        <!-- EXAMINATION TIME -->

        <td>

            <input type="text" class="form-control text-center fw-bold" name="exam_time_${subject.id}" placeholder="2:00 PM - 5:00 PM" required>

        </td>

    `;

        subjectRows.append(subjectRow);

    });


    studentData.append(card1);
    const GenerateCard = card1.querySelector("#GenerateCard");

    if (GenerateCard) {
        GenerateCard.addEventListener("click", generateAdmitCard);
    }

}

function showExistingAdmitCard(data) {

    console.log("Existing Admit Card Data:", data);

    let studentData = document.getElementById('admitData');

    console.log("Admit Form:", studentData);

    // Get CSRF token before clearing form
    let csrfInput = studentData.querySelector(
        'input[name="csrfmiddlewaretoken"]'
    );

    // Clear previous content
    studentData.innerHTML = "";

    // Put CSRF token back
    if (csrfInput) {
        studentData.appendChild(csrfInput);
    }

    // ==============================
    // Create Card
    // ==============================

    let card1 = document.createElement('div');

    card1.className =
        "card border-0 shadow-lg rounded-4 overflow-hidden mb-4";

    card1.innerHTML = `

        <!-- Card Header -->
        <div class="card-header bg-success text-white p-4">

            <div class="d-flex align-items-center gap-3">

                <!-- Icon -->
                <div class="bg-white text-success rounded-circle
                            d-flex align-items-center
                            justify-content-center"
                     style="width: 48px; height: 48px;">

                    <i class="bi bi-check-circle-fill fs-4"></i>

                </div>

                <!-- Title -->
                <div>

                    <h5 class="mb-1 fw-bold">
                        Admit Card Already Generated
                    </h5>

                    <small class="text-white-50">
                        Examination details are already saved.
                    </small>

                </div>

                <!-- Edit Button -->
                <button
                    type="button"
                    id="editBtn"
                    class="btn btn-primary ms-auto shadow">

                    <i class="bi bi-pencil-square me-1"></i>
                    Edit

                </button>

            </div>

        </div>


        <!-- Card Body -->
        <div class="card-body p-4 bg-light">

            <!-- Table -->
            <div class="table-responsive bg-white
                        border rounded-4 shadow-sm">

                <table class="table table-bordered
                              table-hover align-middle
                              text-center mb-0">

                    <thead class="table-dark">

                        <tr>

                            <th>
                                SL No
                            </th>

                            <th>
                                Paper Code
                            </th>

                            <th>
                                Paper Name
                            </th>

                            <th>
                                Examination Date
                            </th>

                            <th>
                                Time
                            </th>

                        </tr>

                    </thead>

                    <tbody id="existingSubjectRows">

                    </tbody>

                </table>

            </div>


            <!-- Edit Buttons -->
            <div
                class="mt-3 text-end"
                id="btnContainer"
                style="display:none;">

                <button
                    type="button"
                    id="editSubmitBtn"
                    class="btn btn-success">

                    <i class="bi bi-check-circle me-1"></i>
                    Submit

                </button>

                <button
                    type="button"
                    id="editCancelBtn"
                    class="btn btn-danger">

                    <i class="bi bi-x-circle me-1"></i>
                    Cancel

                </button>

            </div>

        </div>
    `;


    // ==============================
    // Get Table Body
    // ==============================

    let subjectRows = card1.querySelector(
        '#existingSubjectRows'
    );


    // ==============================
    // Check Data
    // ==============================

    console.log("Subject Data:", data.data);
    console.log("Is Array:",Array.isArray(data.data));


    // ==============================
    // Generate Subject Rows
    // ==============================

    if (Array.isArray(data.data)) {

        data.data.forEach((subject, subjectIndex) => {
            console.log(subject.exam_date)
            let row = document.createElement('tr');

            row.innerHTML = `

                <!-- SL No -->
                <td class="fw-bold">
                    ${subjectIndex + 1}
                </td>


                <!-- Paper Code -->
                <td>

                    <strong>
                        ${subject.subject_code || ''}
                    </strong>

                </td>


                <!-- Paper Name -->
                <td class="text-start fw-semibold">

                    ${subject.subject_name || ''}

                </td>


                <!-- Examination Date -->
                <td>

                    <input
                        type="date" id="exam_date_${subject.subject_id}"
                        value="${subject.exam_date}"
                        readonly class="form-control" style="border:none; background:transparent; box-shadow:none;">
                </td>


                <!-- Examination Time -->
                <td>

                    <input
                        type="text"
                        id="exam_time_${subject.subject_id}"
                        value="${subject.exam_time || ''}"
                        readonly
                        class="form-control"
                        style="border:none;
                               background:transparent;
                               box-shadow:none;">

                </td>

            `;

            subjectRows.appendChild(row);

        });

    } else {

        // If data is not an array
        subjectRows.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="text-danger fw-bold py-4">

                    Invalid examination data format.

                </td>

            </tr>

        `;

    }


    studentData.appendChild(card1);

    const editBtn = card1.querySelector("#editBtn");

    editBtn.addEventListener("click",editFunction);

}
const editFunction = () => {

    const btnContainer = document.getElementById('btnContainer');

    btnContainer.style.display = "block";

    let examDates = document.querySelectorAll('[id^="exam_date_"]');
    let examTimes = document.querySelectorAll('[id^="exam_time_"]');

    examDates.forEach((date) => {

        date.style.border = "1px solid black";
        date.readOnly = false;

    });

    examTimes.forEach((time) => {

        time.style.border = "1px solid black";
        time.readOnly = false;

    });


    document.getElementById('editCancelBtn').onclick = () => {

        examDates.forEach((date) => {

            date.style.border = "none";
            date.readOnly = true;

        });

        examTimes.forEach((time) => {

            time.style.border = "none";
            time.readOnly = true;

        });

        btnContainer.style.display = "none";
    };

    document.getElementById('editSubmitBtn').onclick = () => {

        updateAdmitCard();

    };
};


async function updateAdmitCard() {

    let college_id = document.getElementById('college').value;
    let course_id = document.getElementById('course').value;
    let semester_id = document.getElementById('semester').value;

    let examDates = document.querySelectorAll('[id^="exam_date_"]');
    let examTimes = document.querySelectorAll('[id^="exam_time_"]');

    let subjectData = {};

    examDates.forEach((date) => {

        let subjectId = date.id.replace("exam_date_", "");

        let timeInput = document.getElementById(
            `exam_time_${subjectId}`
        );

        let examDate = date.value;
        let examTime = timeInput.value;

        subjectData[subjectId] = {
            exam_date: examDate,
            exam_time: examTime
        };

    });


    console.log(subjectData);


    let csrfInput = document.querySelector(
        'input[name="csrfmiddlewaretoken"]'
    );

    if (!csrfInput) {
        console.error("CSRF token not found");
        return;
    }

    let csrfToken = csrfInput.value;


    let response = await fetch('/adminpanel/update_admit_card/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            "X-Requested-With": "XMLHttpRequest"
        },

        body: JSON.stringify({

            college_id: college_id,
            course_id: course_id,
            semester_id: semester_id,
            subject_data: subjectData

        })
    }
    );


    let result = await response.json();

    console.log(result);

    if (result.success) {

        alert(result.message);

        document.getElementById('btnContainer').style.display = "none";

        document.querySelectorAll('[id^="exam_date_"]').forEach((date) => {
            date.style.border = "none";
            date.readOnly = true;
        });

        document.querySelectorAll('[id^="exam_time_"]').forEach((time) => {
            time.style.border = "none";
            time.readOnly = true;
        });

    } else {

        alert(result.message);

    }

}

function reverseDate(date) {
    let [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
}

async function generateAdmitCard(event) {
    event.preventDefault()
    let form = document.getElementById('admitData')
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    if (!form) {
        console.error("admitData form not found");
        return;
    }
    const csrfInput = form.querySelector('input[name="csrfmiddlewaretoken"]');
    if (!csrfInput) {
        console.error("CSRF token input not found inside the form.");
        return;
    }
    const csrfToken = csrfInput.value;
    let formData = new FormData(form)
    let response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrfToken
        }
    })
    let result = await response.json()
    const messageBox = document.getElementById("successMessage");
    const messageText = document.querySelector('#messageText')
    if (result.success) {
        messageBox.className = "alert alert-success mt-3";
        messageText.textContent = result.message;
    } else {
        messageBox.className = "alert alert-danger mt-3";
        messageBox.textContent = result.message;
    }
}