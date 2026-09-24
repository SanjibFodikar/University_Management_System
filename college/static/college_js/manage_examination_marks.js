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

document.getElementById('fetchMarksBtn').addEventListener('click', async () => {
    let course = document.getElementById('course').value;
    let semester = document.getElementById('year_semester').value;
    if (!course || !semester) {
        alert("Please Select Course And Semester First")
        return
    }

    let response = await fetch(`/college/manage_examination_marks/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            course: course,
            semester: semester
        })
    })
    let data = await response.json()
    showInHTml(data)
})

function showInHTml(data) {

    let container = document.getElementById('examMarksContainer');

    container.innerHTML = "";

    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="alert alert-warning mt-4">
                No examination marks found.
            </div>
        `;

        return;
    }


    data.forEach((student, index) => {

        let theoryHTML = "";
        let labHTML = "";


        // ==============================
        // SUBJECTS
        // ==============================

        student.subjects_marks.forEach(subject => {

            let row = `
                <tr>

                    <td>
                        ${subject.subject_code}
                    </td>

                    <td>
                        ${subject.subject_name}
                    </td>

                    <td class="text-center">
                        ${subject.marks}
                    </td>

                </tr>
            `;


            if (subject.subject_type === "theory") {

                theoryHTML += row;

            } else if (subject.subject_type === "lab") {

                labHTML += row;

            }

        });


        // ==============================
        // STUDENT CARD
        // ==============================

        let html = `

            <div class="card allStudent shadow-sm border-0 mt-4" style="display: none;">

                <!-- Student Header -->

                <div class="card-header bg-dark text-white">

                    <div class="d-flex justify-content-between align-items-center">

                        <h5 class="mb-0">

                            ${index + 1}. ${student.student__name}

                        </h5>

                        <span class="badge bg-light text-dark">

                            ${student.student__college_course__course_name__course_name}

                        </span>

                    </div>

                </div>


                <div class="card-body">


                    <!-- Student Details -->

                    <div class="row mb-4">

                        <div class="col-md-3">

                            <strong>Roll Number</strong>

                            <p class="mb-0">
                                ${student.student__roll_number}
                            </p>

                        </div>


                        <div class="col-md-4">

                            <strong>Registration Number</strong>

                            <p class="mb-0">
                                ${student.student__registration_number}
                            </p>

                        </div>


                        <div class="col-md-2">

                            <strong>Year</strong>

                            <p class="mb-0">
                                ${student.student__semester__year}
                            </p>

                        </div>


                        <div class="col-md-3">

                            <strong>Semester</strong>

                            <p class="mb-0">
                                ${student.student__semester__semester}
                            </p>

                        </div>

                    </div>


                    <!-- ====================== -->
                    <!-- THEORY -->
                    <!-- ====================== -->

                    <h6 class="fw-bold mb-3">

                        <i class="bi bi-book me-1"></i>

                        Theory Examination

                    </h6>


                    <div class="table-responsive mb-4">

                        <table class="table table-bordered table-hover">

                            <thead class="table-primary">

                                <tr>

                                    <th width="20%">
                                        Subject Code
                                    </th>

                                    <th>
                                        Subject Name
                                    </th>

                                    <th width="15%"
                                        class="text-center">

                                        Marks

                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                ${theoryHTML ||
            `
                                    <tr>
                                        <td colspan="3"
                                            class="text-center text-muted">
                                            No theory subjects
                                        </td>
                                    </tr>
                                    `
            }

                            </tbody>

                        </table>

                    </div>


                    <!-- ====================== -->
                    <!-- LAB -->
                    <!-- ====================== -->

                    <h6 class="fw-bold mb-3">

                        <i class="bi bi-pc-display me-1"></i>

                        Practical / Lab Examination

                    </h6>


                    <div class="table-responsive">

                        <table class="table table-bordered table-hover">

                            <thead class="table-success">

                                <tr>

                                    <th width="20%">
                                        Subject Code
                                    </th>

                                    <th>
                                        Subject Name
                                    </th>

                                    <th width="15%"
                                        class="text-center">

                                        Marks

                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                ${labHTML ||
            `
                                    <tr>
                                        <td colspan="3"
                                            class="text-center text-muted">
                                            No practical / lab subjects
                                        </td>
                                    </tr>
                                    `
            }

                            </tbody>

                        </table>

                    </div>


                    <!-- Action Buttons -->

                    
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">

                <!-- Left Side -->
                <div>

                    <button type="button"
                        class="btn btn-warning btn-sm"
                        onclick="editMarks(${index})">

                        <i class="bi bi-pencil-square me-1"></i>

                        Edit Marks

                    </button>

                </div>


                <!-- Right Side -->
                <div class="d-flex gap-2">

                    <button type="button"
                        class="btn btn-secondary btn-sm"
                        onclick="previousStudent()">

                        <i class="bi bi-arrow-left me-1"></i>

                        Previous

                    </button>


                    <button type="button"
                        class="btn btn-primary btn-sm"
                        id="nextStudent" onclick="nextStudent()">

                        Next

                        <i class="bi bi-arrow-right ms-1"></i>

                    </button>

                </div>

            </div>
    
                </div>

            </div>

        `;

        container.innerHTML += html;
    });
   
   showStudent()
}

let index=0
let allStudent=[]
function showStudent() {
   allStudent = document.querySelectorAll('.allStudent')
   allStudent[index].style.display="block";
}

function nextStudent() {
    index++
    if (allStudent.length-1<index) {
        alert("No Students Are Left")
        index--
        return
    }
    allStudent[index-1].style.display="none";
    allStudent[index].style.display="block";
}

function previousStudent() {
    allStudent[index].style.display="none";
    index--
    if (index<0) {
        alert("No Students Are Left")
        index=0
    }
    allStudent[index].style.display="block";
}