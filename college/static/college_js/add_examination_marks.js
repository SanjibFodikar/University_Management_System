let course = document.getElementById('course');
let courseSeen = new Set();
Array.from(course.options).forEach(option => {
    if (option.value === "") {
        return;
    }

    if (courseSeen.has(option.value)) {
        option.remove();
    } else {
        courseSeen.add(option.value);
    }

});

let semester = document.getElementById('year_semester')
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

document.getElementById('fetchBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    let course = document.getElementById('course').value;
    let semester = document.getElementById('year_semester').value;
    console.log(course, semester)
    if (!course || !semester) {
        alert("PLease Select Course And Semester")
        return
    }
    try {
        let response = await fetch(`/college/fetch_details_for_exam_marks/${course}/${semester}/`)
        let data = await response.json()
        visitSubjectStudent(data)
    } catch (error) {
        console.log(error)
    }

})


function getCSRFToken() {

    let csrfInput = document.querySelector(
        '[name=csrfmiddlewaretoken]'
    );

    if (csrfInput) {
        return csrfInput.value;
    }

    return "";
}

let examData = null;
function visitSubjectStudent(data) {
    examData = data;

    let container = document.getElementById("examMarksContainer");

    if (!container) {
        console.error("examMarksContainer not found");
        return;
    }

    container.innerHTML = "";

    let html = `

        <hr class="my-4">

        <div class="card border">

            <div class="card-body">

                <!-- STUDENT COUNT -->

                <h5 class="fw-bold mb-4">

                    Student

                    <span id="studentCount">1</span>

                    of

                    <span>${data.students.length}</span>

                </h5>

    `;


    // ==========================================
    // STUDENT DETAILS
    // ==========================================

    data.students.forEach((student, index) => {

        html += `

            <div class="studentrows" data-student-id="${student.id}"
                 style="display: ${index === 0 ? "block" : "none"
            };">

                <div class="row mb-4">

                    <!-- LEFT -->

                    <div class="col-md-6">

                        <p>
                            <strong>Name:</strong>
                            ${student.name}
                        </p>

                        <p>
                            <strong>Roll No:</strong>
                            ${student.roll_number}
                        </p>

                        <p>
                            <strong>Registration No:</strong>
                            ${student.registration_number}
                        </p>

                    </div>


                    <!-- RIGHT -->

                    <div class="col-md-6">

                        <p>
                            <strong>Course:</strong>
                            ${student.college_course__course_name__course_name}
                        </p>

                        <p>
                            <strong>Semester:</strong>
                            ${student.semester__year}
                            -
                            ${student.semester__semester}
                        </p>

                    </div>

                </div>

            </div>

        `;

    });


    // ==========================================
    // FORM
    // ==========================================

    html += `

        <form method="POST" id="myform">

            <input type="hidden"
                   name="csrfmiddlewaretoken"
                   value="${getCSRFToken()}">


            <!-- SUBJECTS -->

            <div class="mb-4">

                <label class="form-label fw-bold">

                    Subjects & Examination Marks

                </label>


                <div class="table-responsive">

                    <table class="table table-bordered align-middle">

                        <thead>

                            <tr>

                                <th>
                                    Paper Code
                                </th>

                                <th>
                                    Subject Name
                                </th>

                                <th>
                                    Subject Type
                                </th>

                                <th style="width: 200px;">
                                    Examination Marks
                                </th>

                            </tr>

                        </thead>


                        <tbody>

    `;


    // ==========================================
    // ALL SUBJECTS
    // THEORY + PRACTICAL
    // ==========================================

    data.subjects.forEach((subject) => {

        html += `

            <tr>

                <!-- PAPER CODE -->

                <td>

                    <strong>
                        ${subject.paper_code || ""}
                    </strong>

                </td>


                <!-- SUBJECT NAME -->

                <td>

                    ${subject.subject_name || ""}

                    <input type="hidden" name="subject_id_${subject.id}" value="${subject.id}">

                </td>


                <!-- SUBJECT TYPE -->

                <td>

                    ${subject.subject_type}

                </td>


                <!-- MARKS -->

                <td>

                    <input type="number"
                           name="marks_${subject.id}"
                           id="marks_${subject.id}"
                           class="form-control marksinput"
                           placeholder="Enter marks"
                           min="0"
                           max="70"
                           step="0.01"
                           required>

                    <div id="marks_${subject.id}_error_box"
                         class="text-danger mt-1">
                    </div>

                </td>

            </tr>

        `;

    });


    // ==========================================
    // CLOSE TABLE
    // ==========================================

    html += `

                        </tbody>

                    </table>

                </div>

            </div>


            <!-- SAVE & NEXT -->

            <button type="submit"
                    name="saveMarks"
                    value="1"
                    class="btn btn-success"
                    id="next" onclick="save_next(event)" >

                Save & Next Student

                <i class="bi bi-arrow-right"></i>
                
            </button>


        </form>

            </div>

        </div>

    `;


    // ==========================================
    // DISPLAY
    // ==========================================

    container.innerHTML = html;


    // ==========================================
    // MARKS VALIDATION
    // ==========================================

    let marksInputs = document.querySelectorAll(".marksinput");


    marksInputs.forEach((input) => {

        input.addEventListener("input", function () {

            let errorBox = document.getElementById(
                this.id + "_error_box"
            );

            errorBox.innerHTML = "";


            if (this.value === "") {
                return;
            }


            let value = parseFloat(this.value);


            if (value < 0) {

                errorBox.innerHTML = "Marks cannot be less than 0.";

                this.value = "";

                return;
            }


            if (value > 70) {

                errorBox.innerHTML =
                    "Maximum marks is 70.";

                this.value = "";

                return;
            }

        });

    });


    // ==========================================
    // FORM VALIDATION
    // ==========================================

    let form = document.getElementById("myform");


    if (form) {

        form.addEventListener("submit", function (event) {

            let valid = true;


            let allMarksInputs =
                document.querySelectorAll(
                    ".marksinput"
                );


            allMarksInputs.forEach((input) => {

                let errorBox =
                    document.getElementById(
                        input.id + "_error_box"
                    );

                errorBox.innerHTML = "";


                if (input.value.trim() === "") {

                    errorBox.innerHTML =
                        "Please enter examination marks.";

                    valid = false;

                    return;
                }


                let marks =
                    parseFloat(input.value);


                if (isNaN(marks)) {

                    errorBox.innerHTML =
                        "Please enter a valid number.";

                    valid = false;

                    return;
                }


                if (marks < 0 || marks > 70) {

                    errorBox.innerHTML =
                        "Marks must be between 0 and 70.";

                    valid = false;

                }

            });


            if (!valid) {

                event.preventDefault();

            }

        });

    }

}


const save_next = async (e) => {

    e.preventDefault();

    let valid = true;

    let allMarksInputs =document.querySelectorAll(".marksinput");

    allMarksInputs.forEach((input) => {
        let errorBox = document.getElementById(input.id + "_error_box");

        errorBox.innerHTML = "";

        if (input.value.trim() === "") {
            errorBox.innerHTML ="Please enter examination marks.";
            valid = false;
            return;
        }

        // Number
        let marks = parseFloat(input.value);
        if (isNaN(marks)) {
            errorBox.innerHTML ="Please enter a valid number.";
            valid = false;
            return;
        }

        // Range
        if (marks < 0 || marks > 70) {
            errorBox.innerHTML ="Marks must be between 0 and 70.";
            valid = false;
            return;
        }

    });

    if (!valid) {
        return;
    }

    let studentRows = document.querySelectorAll(".studentrows");
    let currentIndex = -1;
    studentRows.forEach((row, index) => {
        if (row.style.display === "block") {
            currentIndex = index;
        }

    });


    if (currentIndex === -1) {
        alert("Student not found.");
        return;

    }


    let currentStudent = studentRows[currentIndex];

    let studentId = currentStudent.dataset.studentId;


    // ==========================================
    // SUBJECT DATA
    // ==========================================

    let subjects = [];

    examData.subjects.forEach((subject) => {

        let marksInput = document.getElementById(`marks_${subject.id}`);

        subjects.push({
            subject_id: subject.id,
            subject_name:subject.subject_name,
            subject_code:subject.paper_code,
            subject_type:subject.subject_type,
            marks:marksInput.value

        });

    });


    // ==========================================
    // SEND DATA
    // ==========================================

    let sendData = {
        student_id: studentId,
        subjects: subjects
    };

    console.log(sendData);
    try {

        let response = await fetch("/college/save_university_exam_marks/",{
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                    "X-CSRFToken":getCSRFToken()
                },

                body:JSON.stringify(sendData)
            }
        );


        let result = await response.json();

        if (response.status === 201) {

            Toastify({

                text: result.message,

                duration: 2000,

                gravity: "top",

                position: "right",

                style: {

                    background: "green",

                    color: "white"

                }

            }).showToast();


            let nextIndex = currentIndex + 1;


            // Check next student exists
            if (nextIndex < studentRows.length) {
                currentStudent.style.display = "none";


                let nextStudent = studentRows[nextIndex];
                nextStudent.style.display = "block";

                // Update student count
                document.getElementById("studentCount").innerText = nextIndex + 1;


                // Clear all marks
                allMarksInputs.forEach((input) => {
                    input.value = "";
                    let errorBox = document.getElementById(input.id +"_error_box");
                    if (errorBox) {
                        errorBox.innerHTML = "";
                    }

                });

            }


            else {

                Toastify({
                    text:"All students' marks have been saved.",
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "green",
                        color: "white"
                    }
                }).showToast();
            }
        }

        else {
            Toastify({
                text:result.message ||"Failed to save marks.",
                duration: 2000,
                gravity: "top",
                position: "right",
                style: {
                    background: "red",
                    color: "white"
                }
            }).showToast();
        }

    } catch (error) {
        console.error(error);
        Toastify({
            text:
                "Something went wrong.",
            duration: 2000,
            gravity: "top",
            position: "right",
            style: {
                background: "red",
                color: "white"
            }
        }).showToast();
    }
};