document.getElementById('course').addEventListener('change', csData)
document.getElementById('semester').addEventListener('change', csData)

function csData() {
    let course = document.getElementById('course').value;
    let semester = document.getElementById('semester').value;
    console.log(semester)
    if (course === "" || semester === "") {
        document.getElementById('pcaMarksContainer').innerHTML="";
        document.getElementById('next-previous').classList.remove('d-flex')
        document.getElementById('next-previous').classList.add('d-none');
        return;
    }
    if (course && semester) {
        fetch(`/college/fetchpcadata/${course}/${semester}/`)
            .then(a => a.json())
            .then(data => {

    let pcaMarksContainer = document.getElementById('pcaMarksContainer');

    data.forEach(student => {

        // Create card
        let card = document.createElement("div");

        card.className = "card border-0 shadow-sm mb-4 pca-student-card";
        card.style.display="none";
        card.innerHTML = `

            <!-- Student Header -->
            <div class="card-header bg-primary text-white p-3">

                <div class="d-flex justify-content-between
                            align-items-center flex-wrap gap-3">

                    <!-- Student Info -->
                    <div>

                        <h5 class="mb-2 fw-bold">

                            <i class="bi bi-person-circle me-2"></i>

                            ${student.student__name}

                        </h5>

                        <div class="d-flex gap-2 flex-wrap
                                    align-items-center small">

                            <strong>
                                <i class="bi bi-person-badge me-1"></i>
                                Roll:
                                <strong>
                                    ${student.student__roll_number || "N/A"}
                                </strong>
                            </strong>

                            <span class="opacity-75">|</span>

                            <strong>
                                <i class="bi bi-card-text me-1"></i>
                                Registration:
                                <strong>
                                    ${student.student__registration_number || "N/A"}
                                </strong>
                            </strong>

                        </div>

                    </div>


                    <!-- Status and Actions -->
                    <div class="d-flex align-items-center gap-2 flex-wrap">

                        <!-- Status -->
                        <span class="
                            ${student.student__university_verify
                                ? 'btn btn-success'
                                : 'btn btn-danger'}">

                            <i class="bi
                                ${student.student__university_verify
                                    ? 'bi-check-circle'
                                    : 'bi-x-circle'} me-1"></i>

                            ${student.student__university_verify
                                ? 'Active'
                                : 'Inactive'}

                        </span>


                        <!-- Edit Button -->
                        <button
                            class="btn btn-light btn-sm"
                            id="${student.student_id}"
                            onclick="edit_pca_marks(this.id)">

                            <i class="bi bi-pencil-square me-1"></i>
                            Edit

                        </button>


                        <!-- PCA Badge -->
                        <span class="badge bg-white text-primary">

                            <i class="bi bi-journal-check me-1"></i>
                            PCA Marks

                        </span>

                    </div>

                </div>

            </div>


            <!-- Student Details -->
            <div class="card-body p-3">

                <div class="row g-3 mb-4">


                    <!-- Course -->
                    <div class="col-md-4">

                        <div class="border rounded-3 p-3 h-100">

                            <small class="text-muted d-block mb-1">

                                <i class="bi bi-book me-1"></i>
                                Course

                            </small>

                            <strong class="course-name">

                                ${student.course__course_name__course_name}

                            </strong>

                        </div>

                    </div>


                    <!-- Year -->
                    <div class="col-md-4">

                        <div class="border rounded-3 p-3 h-100">

                            <small class="text-muted d-block mb-1">

                                <i class="bi bi-calendar3 me-1"></i>
                                Year

                            </small>

                            <strong class="semester-year">

                                ${student.semester__year}

                            </strong>

                        </div>

                    </div>


                    <!-- Semester -->
                    <div class="col-md-4">

                        <div class="border rounded-3 p-3 h-100">

                            <small class="text-muted d-block mb-1">

                                <i class="bi bi-layers me-1"></i>
                                Semester

                            </small>

                            <strong class="semester-name">

                                ${student.semester__semester}

                            </strong>

                        </div>

                    </div>

                </div>


                <hr class="my-4">


                <!-- Subject Marks Heading -->
                <div class="d-flex align-items-center
                            justify-content-between mb-3">

                    <h6 class="fw-bold mb-0">

                        <i class="bi bi-book me-2 text-primary"></i>

                        Subject-wise PCA Marks

                    </h6>

                    <span class="badge bg-primary-subtle text-primary">

                        ${student.subjects ? student.subjects.length : 0} Subjects

                    </span>

                </div>


                <!-- Table -->
                <div class="table-responsive">

                    <table class="table table-hover
                                  align-middle mb-0">

                        <thead class="table-light">

                            <tr>

                                <th class="text-center">
                                    #
                                </th>

                                <th>
                                    Subject Name
                                </th>

                                <th>
                                    Paper Code
                                </th>

                                <th class="text-center">
                                    Marks
                                </th>

                            </tr>

                        </thead>


                        <tbody class="subject-marks-body">

                        </tbody>

                    </table>

                </div>

<div class="edit-actions  mt-4" id="actions_${student.student_id}" style="display: none;">
    <button
        type="button" class="btn btn-success btn-md me-3" id="submit_${student.student_id}"
        name="saveMarks" onclick="submit_pca_marks(this.id)">
        <i class="bi bi-check-lg me-1"></i>
        Submit
    </button>

    <button
        type="button"
        class="btn btn-outline-danger btn-md"
        id="cancel_${student.student_id}"
        onclick="cancel_pca_marks(this.id)">
        <i class="bi bi-x-lg me-1"></i>
        Cancel
    </button>
</div>

            </div>

        `;


        // Subject body
        let subjectBody =
            card.querySelector(".subject-marks-body");


        if (student.subjects && student.subjects.length > 0) {

            student.subjects.forEach((subject, index) => {

                subjectBody.innerHTML += `

                    <tr>

                        <td class="text-center text-muted">
                            ${index + 1}
                        </td>

                        <td class="fw-medium">
                            ${subject.subject_name}
                        </td>

                        <td>
                            <span class="badge bg-light text-dark border">
                                ${subject.subject_code}
                            </span>
                        </td>

                        <td class="text-center">
                          
                            <input
                                type="text"
                                class="form-control form-control-sm text-center fw-bold"
                                value="${subject.marks}" readonly
                                id="pcaMarks_${student.student_id}_${subject.subject_id}"
                                name="pcaMarks_${student.student_id}_${subject.subject_id}"
                                style="width: 80px; margin: auto;"
                            >

            
                        </td>

                    </tr>

                `;

            });

        } else {

            subjectBody.innerHTML = `

                <tr>

                    <td colspan="4"
                        class="text-center text-muted py-4">

                        <i class="bi bi-info-circle me-2"></i>

                        No PCA marks available.

                    </td>

                </tr>

            `;

        }
        

        // Append card
        pcaMarksContainer.appendChild(card);
        

    });
    document.getElementById('next-previous').classList.remove('d-none');
    document.getElementById('next-previous').classList.add('d-flex')
    visitStudent()
    
});
    }
}


function edit_pca_marks(id) {
    document.getElementById('actions_'+id).style.display = "block";
    const inputs = document.querySelectorAll(
        `[id^="pcaMarks_${id}_"]`
    );

    inputs.forEach(input => {
        input.readOnly = false;
    });
}

function cancel_pca_marks(id) {
    let cancelid=id.replace('cancel_',"")
    document.getElementById('actions_'+cancelid).style.display = "none";
    const inputs = document.querySelectorAll(
        `[id^="pcaMarks_${cancelid}_"]`
    );

    inputs.forEach(input => {
        input.readOnly = true;
    });
}

const csrftoken = document.querySelector(
    '[name="csrfmiddlewaretoken"]'
).value;

function submit_pca_marks(id){
    let studentId=id.replace('submit_',"")
    let formData=new FormData()
    formData.append('studentId',studentId)
    formData.append('saveMarks','1')
    let inputs=document.querySelectorAll(`[id^="pcaMarks_${studentId}_"]`)
    inputs.forEach(input => {
         let subjectId=input.id.split("_").pop();
         formData.append('subjectIds',subjectId)
         formData.append("marks", input.value);
    })
    

    fetch("/college/edit_pca_marks/",{
        method:"POST",
        body:formData,
        headers:{
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken
        }
    })
    .then(a=>a.json())
    .then(data=>{
        console.log(data)
    })
    .catch(error=>{
        console.log(error)
    })
}


let index=0
let studentsData=[]
function visitStudent() {
    studentsData=document.querySelectorAll('.pca-student-card')
         if (index==0) {
            studentsData[index].style.display="block";
            document.getElementById('updatedStudent').innerText=index+1;
            document.getElementById('totalStudent').innerText=studentsData.length;
            return
         }
         if (studentsData.length === index) {
            index--
            alert("All Students Are Visited. No Student Left")
            return
         }
         studentsData[index-1].style.display="none";
         studentsData[index].style.display="block";
         document.getElementById('updatedStudent').innerText=index+1;
}

function nextStudent(){
    index++
    visitStudent()
}

function previousStudent(){
    if (index==0) {
        alert('This Is Your First Student')
        return
    }
    index--
    studentsData[index+1].style.display="none"
    studentsData[index].style.display="block"
    document.getElementById('updatedStudent').innerText=index+1;
}


document.getElementById('searchStudent').addEventListener('input', () => {

    let searchValue = document.getElementById('searchStudent').value.toLowerCase().trim();

    let studentCards = document.querySelectorAll('.pca-student-card');

    let matchedCount = 0;

    studentCards.forEach(card => {

        let cardText = card.innerText.toLowerCase();

        if (cardText.includes(searchValue)) {
            card.style.display = "block";
            matchedCount++;
        } else {
            card.style.display = "none";
        }

    });

    // if search empty navigation will start
    if (searchValue === "") {
        index = 0;
        studentsData = studentCards;

        studentCards.forEach(card => {
            card.style.display = "none";
        });

        visitStudent();
        return;
    }

    // Search result count update
    if (searchValue !== "") {
        document.getElementById('updatedStudent').innerText =
            matchedCount > 0 ? 1 : 0;

        document.getElementById('totalStudent').innerText =
            matchedCount;
    }

});