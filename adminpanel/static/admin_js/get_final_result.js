document.getElementById('college').addEventListener('change', async (e) => {

    let college_id = e.target.value;

    let response = await fetch(
        `/adminpanel/get_course_semester/${college_id}/`
    );

    let data = await response.json();

    let course = document.getElementById('course');
    let semester = document.getElementById('semester');

    course.innerHTML =
        `<option value="">-- Select Course --</option>`;

    semester.innerHTML =
        `<option value="">-- Select Semester --</option>`;

    data.forEach(element => {

        course.innerHTML += `
            <option value="${element.college_course__course_name_id}">
                ${element.college_course__course_name__course_name}
            </option>
        `;

        semester.innerHTML += `
            <option value="${element.semester_id}">
                ${element.semester__year} - ${element.semester__semester}
            </option>
        `;

    });

    semester_unique();
    course_unique();

});


function semester_unique() {

    let semester =
        document.getElementById('semester');

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

    let course =
        document.getElementById('course');

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


function getGrade(mark) {

    if (
        mark === "-" ||
        mark === null ||
        mark === undefined ||
        mark === ""
    ) {
        return "-";
    }

    mark = Number(mark);

    if (mark > 90) {
        return "O";
    }
    else if (mark > 80) {
        return "A+";
    }
    else if (mark > 70) {
        return "A";
    }
    else if (mark > 60) {
        return "B";
    }
    else if (mark > 50) {
        return "C";
    }
    else if (mark > 40) {
        return "D";
    }
    else {
        return "Fail";
    }

}


document.getElementById('load_result').addEventListener(
    'click',
    async () => {

        let college_id =
            document.getElementById('college').value;

        let course_id =
            document.getElementById('course').value;

        let semester_id =
            document.getElementById('semester').value;

        if (
            !college_id ||
            !course_id ||
            !semester_id
        ) {

            alert(
                "Please enter college, course, semester"
            );

            return;

        }

        let formContainer =
            document.getElementById('formContainer');

        let response = await fetch(
            formContainer.action,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    college_id:
                        college_id,

                    course_id:
                        course_id,

                    semester_id:
                        semester_id

                })
            }
        );

        let data =
            await response.json();

        displayData(data);

    }
);


const displayData = (data) => {

    const container =
        document.getElementById(
            "student_result_container"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    let searchInput =
        document.getElementById("search");

    if (searchInput) {
        searchInput.value = "";
    }

    if (
        !data ||
        data.status !== 200
    ) {

        container.innerHTML = `

            <div class="alert alert-danger">

                ${data?.message || "No data found"}

            </div>

        `;

        return;

    }

    let caData =
        Array.isArray(data.ca_marks)
            ? data.ca_marks
            : [];

    let pcaData =
        Array.isArray(data.pca_marks)
            ? data.pca_marks
            : [];

    let writtenData =
        Array.isArray(data.theory_marks)
            ? data.theory_marks
            : [];

    let result = {};


    caData.forEach(element => {

        let key =
            `${element.student_id}_${element.subject_id}`;

        if (!result[key]) {

            result[key] = {

                student_id:
                    element.student_id,

                student_name:
                    element.student_name,

                roll_number:
                    element.roll_number ?? "-",

                registration_number:
                    element.registration_number ?? "-",

                year:
                    element.year ?? "-",

                semester:
                    element.semester ?? "-",

                subject_id:
                    element.subject_id,

                subject_name:
                    element.subject_name ?? "-",

                subject_type:
                    element.subject_type ?? "theory",

                ca_marks: [],

                pca_marks:
                    null,

                written_marks:
                    null

            };

        }

        result[key].ca_marks.push({

            ca_type:
                element.ca_type,

            marks:
                Number(element.marks)

        });

    });


    pcaData.forEach(element => {

        let subjectMarks =
            element.subject_marks || {};

        Object.entries(subjectMarks).forEach(
            ([subject_id, marks]) => {

                let key =
                    `${element.student_id}_${subject_id}`;

                if (!result[key]) {

                    result[key] = {

                        student_id:
                            element.student_id,

                        student_name:
                            element.student_name,

                        roll_number:
                            element.roll_number ?? "-",

                        registration_number:
                            element.registration_number ?? "-",

                        year:
                            element.year ?? "-",

                        semester:
                            element.semester ?? "-",

                        subject_id:
                            subject_id,

                        subject_name:
                            "-",

                        subject_type:
                            "lab",

                        ca_marks: [],

                        pca_marks:
                            null,

                        written_marks:
                            null

                    };

                }

                result[key].pca_marks =
                    Number(marks);

            }
        );

    });


    writtenData.forEach(element => {

        let subjects =
            Array.isArray(element.subjects_marks)
                ? element.subjects_marks
                : [];

        subjects.forEach(subject => {

            let subject_id =
                subject.id ??
                subject.subject_id;

            let key =
                `${element.student_id}_${subject_id}`;

            if (!result[key]) {

                result[key] = {

                    student_id:
                        element.student_id,

                    student_name:
                        element.student_name,

                    roll_number:
                        element.roll_number ?? "-",

                    registration_number:
                        element.registration_number ?? "-",

                    year:
                        element.year ?? "-",

                    semester:
                        element.semester ?? "-",

                    subject_id:
                        subject_id,

                    subject_name:
                        subject.subject_name ?? "-",

                    subject_type:
                        subject.subject_type ?? "theory",

                    ca_marks: [],

                    pca_marks:
                        null,

                    written_marks:
                        null

                };

            }

            result[key].subject_name =
                subject.subject_name ??
                result[key].subject_name;

            result[key].subject_type =
                subject.subject_type ??
                result[key].subject_type;

            result[key].written_marks =
                Number(subject.marks);

        });

    });


    let students = {};


    Object.values(result).forEach(element => {

        if (!students[element.student_id]) {

            students[element.student_id] = {

                student_id:
                    element.student_id,

                student_name:
                    element.student_name,

                roll_number:
                    element.roll_number,

                registration_number:
                    element.registration_number,

                year:
                    element.year,

                semester:
                    element.semester,

                subjects: []

            };

        }

        let student =
            students[element.student_id];

        if (
            student.roll_number === "-" &&
            element.roll_number !== "-"
        ) {

            student.roll_number =
                element.roll_number;

        }

        if (
            student.registration_number === "-" &&
            element.registration_number !== "-"
        ) {

            student.registration_number =
                element.registration_number;

        }

        if (
            student.year === "-" &&
            element.year !== "-"
        ) {

            student.year =
                element.year;

        }

        if (
            student.semester === "-" &&
            element.semester !== "-"
        ) {

            student.semester =
                element.semester;

        }

        student.subjects.push(
            element
        );

    });


    if (
        Object.keys(students).length === 0
    ) {

        container.innerHTML = `

            <div class="no-result">

                <i class="bi bi-file-earmark-x"></i>

                <div>
                    No result found
                </div>

            </div>

        `;

        return;

    }


    Object.values(students).forEach(student => {

        let firstLetter =
            (student.student_name || "S")
                .charAt(0)
                .toUpperCase();

        let studentCard =
            document.createElement("div");

        studentCard.className =
            "student-result-card";

        studentCard.innerHTML = `

            <div class="student-info">

                <div class="student-title">

                    <div class="student-avatar">
                        ${firstLetter}
                    </div>

                    <div>

                        <h5>
                            ${student.student_name ?? "-"}
                        </h5>

                        <small>
                            Student Academic Information
                        </small>

                    </div>

                </div>


                <div class="row g-3">

                    <div class="col-lg-3 col-md-6">

                        <div class="student-detail">

                            <label>
                                Roll Number
                            </label>

                            <strong>
                                ${student.roll_number ?? "-"}
                            </strong>

                        </div>

                    </div>


                    <div class="col-lg-3 col-md-6">

                        <div class="student-detail">

                            <label>
                                Registration Number
                            </label>

                            <strong>
                                ${student.registration_number ?? "-"}
                            </strong>

                        </div>

                    </div>


                    <div class="col-lg-3 col-md-6">

                        <div class="student-detail">

                            <label>
                                Year
                            </label>

                            <strong>
                                ${student.year ?? "-"}
                            </strong>

                        </div>

                    </div>


                    <div class="col-lg-3 col-md-6">

                        <div class="student-detail">

                            <label>
                                Semester
                            </label>

                            <strong>
                                ${student.semester ?? "-"}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            <div class="marks-section">

                <div class="table-responsive">

                    <table class="
                        table
                        table-bordered
                        table-hover
                        align-middle
                        text-center
                        marks-table
                    ">

                        <thead class="table-dark">

                            <tr>

                                <th>SL</th>

                                <th>Subject</th>

                                <th>Subject Type</th>

                                <th>CA1</th>

                                <th>CA2</th>

                                <th>CA3</th>

                                <th>PCA</th>

                                <th>Written</th>

                                <th>Final</th>

                            </tr>

                        </thead>


                        <tbody></tbody>


                        <tfoot></tfoot>

                    </table>

                </div>

            </div>

        `;


        let tbody =
            studentCard.querySelector("tbody");

        let tfoot =
            studentCard.querySelector("tfoot");

        let sl = 1;

        let totalMarks = 0;

        let totalSubjects = 0;

        let studentFailed = false;


        student.subjects.forEach(element => {

            let ca1 = 0;
            let ca2 = 0;
            let ca3 = 0;


            if (element.ca_marks) {

                element.ca_marks.forEach(item => {

                    if (
                        item.ca_type === "CA1"
                    ) {

                        ca1 =
                            Number(item.marks) || 0;

                    }

                    else if (
                        item.ca_type === "CA2"
                    ) {

                        ca2 =
                            Number(item.marks) || 0;

                    }

                    else if (
                        item.ca_type === "CA3"
                    ) {

                        ca3 =
                            Number(item.marks) || 0;

                    }

                });

            }


            let pca =
                Number(element.pca_marks) || 0;


            let written =
                element.written_marks !== null &&
                element.written_marks !== undefined
                    ? Number(element.written_marks)
                    : 0;


            let finalMarks;


            if (
                element.subject_type === "theory"
            ) {

                let caAverage =
                    (ca1 + ca2 + ca3) / 3;

                finalMarks =
                    5 +
                    written +
                    caAverage;

            }

            else {

                finalMarks =
                    5 +
                    written +
                    pca;

            }


            finalMarks =
                Number(
                    finalMarks.toFixed(2)
                );


            if (finalMarks < 40) {

                studentFailed = true;

            }


            totalMarks +=
                finalMarks;

            totalSubjects++;


            let hasCA1 =
                element.ca_marks?.some(
                    item =>
                        item.ca_type === "CA1"
                );

            let hasCA2 =
                element.ca_marks?.some(
                    item =>
                        item.ca_type === "CA2"
                );

            let hasCA3 =
                element.ca_marks?.some(
                    item =>
                        item.ca_type === "CA3"
                );


            let ca1Display =
                hasCA1
                    ? ca1
                    : "-";


            let ca2Display =
                hasCA2
                    ? ca2
                    : "-";


            let ca3Display =
                hasCA3
                    ? ca3
                    : "-";


            let pcaDisplay =
                element.pca_marks !== null &&
                element.pca_marks !== undefined
                    ? pca
                    : "-";


            let writtenDisplay =
                element.written_marks !== null &&
                element.written_marks !== undefined
                    ? written
                    : "-";


            tbody.innerHTML += `

                <tr>

                    <td>
                        ${sl++}
                    </td>


                    <td>
                        ${element.subject_name ?? "-"}
                    </td>


                    <td>
                        ${element.subject_type ?? "-"}
                    </td>


                    <td>

                        ${ca1Display}

                      
                    </td>


                    <td>

                        ${ca2Display}

                     
                    </td>


                    <td>

                        ${ca3Display}

                       
                    </td>


                    <td>

                        ${pcaDisplay}

                    </td>


                    <td>

                        ${writtenDisplay}
                    </td>


                    <td>

                        <strong>
                            ${finalMarks}
                        </strong>

                        <br>

                        <small>
                            ${getGrade(finalMarks)}
                        </small>

                    </td>

                </tr>

            `;

        });


        if (studentFailed) {

            tfoot.innerHTML = `

                <tr class="table-danger">

                    <th colspan="8"
                        class="text-end">

                        Result

                    </th>

                    <th>

                        XP

                    </th>

                </tr>

            `;

        }

        else {

            let percentage = 0;

            if (totalSubjects > 0) {

                percentage =
                    totalMarks /
                    totalSubjects;

            }

            percentage =
                Number(
                    percentage.toFixed(2)
                );


            let overallGrade =
                getGrade(percentage);


            tfoot.innerHTML = `

                <tr class="table-light">

                    <th colspan="8"
                        class="text-end">

                        Total Final Marks

                    </th>

                    <th>

                        ${totalMarks.toFixed(2)}

                    </th>

                </tr>


                <tr class="table-light">

                    <th colspan="8"
                        class="text-end">

                        Percentage

                    </th>

                    <th>

                        ${percentage.toFixed(2)}%

                    </th>

                </tr>


                <tr class="table-light">

                    <th colspan="8"
                        class="text-end">

                        Overall Grade

                    </th>

                    <th>

                        ${overallGrade}

                    </th>

                </tr>

            `;

        }


        container.appendChild(
            studentCard
        );

    });

};


document.getElementById("search").addEventListener(
    "input",
    function () {

        let searchValue =
            this.value
                .toLowerCase()
                .trim();

        let studentCards =
            document.querySelectorAll(
                ".student-result-card"
            );

        let found = false;


        studentCards.forEach(card => {

            let studentName =
                card.querySelector(
                    ".student-title h5"
                )?.innerText
                .toLowerCase() || "";


            let studentInfo =
                card.querySelector(
                    ".student-info"
                )?.innerText
                .toLowerCase() || "";


            if (
                studentName.includes(searchValue) ||
                studentInfo.includes(searchValue)
            ) {

                card.style.display = "";

                found = true;

            }

            else {

                card.style.display =
                    "none";

            }

        });


        let oldMessage =
            document.getElementById(
                "student-search-no-result"
            );


        if (oldMessage) {

            oldMessage.remove();

        }


        if (
            searchValue !== "" &&
            !found
        ) {

            let message =
                document.createElement("div");

            message.id =
                "student-search-no-result";

            message.className =
                "alert alert-warning text-center";

            message.innerHTML = `

                <i class="bi bi-search"></i>

                No student found for

                <strong>
                    "${searchValue}"
                </strong>

            `;

            let container =
                document.getElementById(
                    "student_result_container"
                );

            container.prepend(message);

        }

    }
);