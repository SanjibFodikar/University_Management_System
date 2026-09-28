document.getElementById('college').addEventListener('change', async (e) => {
    let college_id = e.target.value;
    let response = await fetch(`/adminpanel/get_course_semester/${college_id}/`)
    let data = await response.json()
    let course = document.getElementById('course')
    let semester = document.getElementById('semester')
    course.innerHTML = `<option value="">Choose Course</option>`;
    semester.innerHTML = `<option value="">Choose Semester</option>`;
    data.forEach(element => {
        course.innerHTML += `<option value="${element.college_course__course_name_id}">${element.college_course__course_name__course_name
            }</option>`;
 
        semester.innerHTML += `<option value="${element.semester_id}">${element.semester__year}
        - ${element.semester__semester}</option>`;
        
    });
    semester_unique()
    course_unique()
})


function semester_unique() {
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

function course_unique() {
    let course = document.getElementById('course')
    let courseSet = new Set()
    Array.from(course.options).forEach((option) => {
        if (option.value === "") {
            return;
        }
        if (courseSet.has(option.value)) {
            option.remove()
        } else {
            courseSet.add(option.value)
        }
    })
}

document.getElementById('fetchResultBtn').addEventListener('click',async(e)=>{
    e.preventDefault()
    let college=document.getElementById('college').value;
    let course=document.querySelector('#course').value;
    let semester=document.getElementById('semester').value;
    if (!college || !course || !semester) {
        alert('please select college course and semester')
        return;
    }
    let studentForm=document.getElementById('studentForm')
    let response=await fetch(studentForm.action,{
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            'college':college,
            'course':course,
            'semester':semester
        })
    })
    let data=await response.json()

    console.log(data)

    let resultContainer = document.getElementById('resultContainer');

    if (data.length<1) {
        resultContainer.innerHTML = 'Result is not applied yet';
        return;
    }

    resultContainer.innerHTML = '';

    data.forEach((student) => {

        let studentCard = `
            <div class="card shadow-sm border-0 mb-4 student-result">

                <div class="card-header bg-light">

                    <div class="row">

                        <div class="col-md-4">
                            <strong>Student Name:</strong>
                            <span class="student-name">
                                ${student.student__name}
                            </span>
                        </div>

                        <div class="col-md-4">
                            <strong>Roll Number:</strong>
                            <span class="roll-number">
                                ${student.student__roll_number}
                            </span>
                        </div>

                        <div class="col-md-4">
                            <strong>Registration:</strong>
                            <span class="registration-number">
                                ${student.student__registration_number}
                            </span>
                        </div>

                    </div>

                </div>

                <div class="card-body">

                    <div class="table-responsive">

                        <table class="table table-bordered table-hover align-middle mb-0">

                            <thead class="table-dark">

                                <tr>
                                    <th>Sl No</th>
                                    <th>Subject Code</th>
                                    <th>Subject Name</th>
                                    <th>Subject Type</th>
                                    <th>Writing Marks</th>
                                    <th>Out of</th>
                                </tr>

                            </thead>

                            <tbody>

                                ${student.subjects_marks.map((subject, index) => `

                                    <tr>

                                        <td>${index + 1}</td>

                                        <td>
                                            ${subject.subject_code}
                                        </td>

                                        <td>
                                            ${subject.subject_name}
                                        </td>

                                        <td>
                                            <span class="badge ${
                                                subject.subject_type === 'theory'
                                                ? 'bg-primary'
                                                : 'bg-success'
                                            }">
                                                ${subject.subject_type}
                                            </span>
                                        </td>

                                        <td class="fw-bold">
                                            ${subject.marks}
                                        </td>

                                        <td>
                                            ${subject.subject_type === 'theory' ? 70 : 70}
                                        </td>

                                    </tr>

                                `).join('')}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        `;

        resultContainer.innerHTML += studentCard;

    });
})