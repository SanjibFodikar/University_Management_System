document.getElementById('college').addEventListener('change', () => {
    let id = document.getElementById('college').value;
    let course = document.getElementById('course')
    let semester = document.getElementById('semester')
    let ca_type = document.getElementById('ca_type')

    fetch(`/adminpanel/ca_marks_fetch/${id}/`)
        .then(a => a.json())
        .then(data => {
            course.innerHTML = `<option value=""">Select Course</option>`
            semester.innerHTML = `<option value=""">Select Semester</option>`
            ca_type.innerHTML = `<option value=""">Select CA Type</option>`
            data.course_type.forEach(value => {
                console.log(value)
                course.innerHTML += `<option value="${value.college_data__college_course_id}">${value.college_data__college_course__course_name__course_name}</option>`
            });

            data.semester_type.forEach(value => {
                semester.innerHTML += `<option value="${value.subject_teacher__semester_id}">${value.subject_teacher__semester__year} - ${value.subject_teacher__semester__semester}</option>`
            });

            data.ca_type.forEach(value => {
                ca_type.innerHTML += `<option value="${value.ca_type}">${value.ca_type}</option>`
            });
        })
        .catch(error => {
            console.error(error);
        });

})

document.getElementById('college').addEventListener('change', loadData)
document.getElementById('course').addEventListener('change', loadData)
document.getElementById('semester').addEventListener('change', loadData)
document.getElementById('ca_type').addEventListener('change', loadData)
let students = [];
let currentIndex = 0;


function loadData() {

    let college_id = document.getElementById('college').value;
    let course_id = document.getElementById('course').value;
    let semester_id = document.getElementById('semester').value;
    let ca_type = document.getElementById('ca_type').value;

    if (college_id && course_id && semester_id && ca_type) {

        fetch(`/adminpanel/fetch_students_ca_data/${college_id}/${course_id}/${semester_id}/${ca_type}/`)
            .then(a => a.json())
            .then(data => {
                students = data;
                currentIndex = 0;

                document.getElementById('studentData').style.display = "block";
                showStudent();

            });
    } else {
        document.getElementById('studentData').style.display = "none";
    }
}

function showStudent() {

    let student = students[currentIndex];

    document.getElementById('studentName').innerText = student.name;
    document.getElementById('collegeName').innerText = student.college;
    document.getElementById('rollNumber').innerText = student.roll_number;
    document.getElementById('caType').innerText = student.ca_type;
    document.getElementById('semesterName').innerText = student.semester;
    document.getElementById('studentYear').innerText = student.year;

    document.getElementById('subjectName').innerHTML = "";
    document.getElementById('subjectMarks').innerHTML = "";


    student.subjects.forEach(e => {
        document.getElementById('subjectName').innerHTML += `
            <div class="border-bottom py-3 px-2 fw-semibold text-dark">
                <i class="bi bi-book me-2 text-primary"></i>
                ${e.subject}
            </div>
        `;

        document.getElementById('subjectMarks').innerHTML += `
            <div class="border-bottom py-3 px-2 text-center">
                <span class="badge bg-success fs-6 px-3 py-2">
                    ${e.marks}
                </span>
            </div>
        `;

    });


    document.getElementById('previousBtn').disabled = currentIndex === 0;

    document.getElementById('nextBtn').disabled = currentIndex === students.length - 1;

    document.getElementById('studentCounter').innerHTML = `<h1>${currentIndex + 1} / ${students.length}</h1>`;
}

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex < students.length - 1) {
        currentIndex++;
        showStudent();
    }
});

document.getElementById('previousBtn').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        showStudent();
    }
    
});