document.getElementById('college').addEventListener('change',async(e)=>{
    let college_id=e.target.value;
    try{
        let response=await fetch(`/adminpanel/fetch_course_semester/${college_id}/`)
        let data=await response.json();
        data.forEach(element => {
            document.getElementById('course').innerHTML+=`<option value="${element.course_id}"> ${element.course__course_name__course_name} </option>`;
            document.getElementById('semester').innerHTML+=`<option value="${element.semester_id}"> ${element.semester__year} - ${element.semester__semester} </option>`;
        });
    }catch(error){
       console.log(error)
    }
        
})

document.getElementById('college').addEventListener('change',getStudentData)
document.getElementById('course').addEventListener('change',getStudentData)
document.getElementById('semester').addEventListener('change',getStudentData)

async function getStudentData() {

    let college_id = document.getElementById("college").value;
    let course_id = document.getElementById("course").value;
    let semester_id = document.getElementById("semester").value;

    let container = document.getElementById("pcaMarksContainer");

    if (!college_id || !course_id || !semester_id) {
        container.innerHTML = "";
        return;
    }

    try {

        let response = await fetch(
            `/adminpanel/admin_get_pca_marks/${college_id}/${course_id}/${semester_id}/`
        );

        let data = await response.json();

        container.innerHTML = "";

        data.forEach((student, index) => {

            console.log(student);

            let card = document.createElement("div");

            card.className = "card d-none allCard shadow-sm mb-4";

            card.innerHTML = `

                <div class="card-header bg-primary text-white">

                    <h5 class="mb-1">
                        ${student.student_name}
                    </h5>

                    <small>
                        Roll: ${student.roll_number}
                    </small>

                </div>

                <div class="card-body">

                    <div class="row mb-3">

                        <div class="col-md-6">
                            <strong>Registration Number:</strong>
                            ${student.registration_number}
                        </div>

                        <div class="col-md-6">
                            <strong>Course:</strong>
                            ${student.course_name}
                        </div>

                        <div class="col-md-6 mt-2">
                            <strong>Year:</strong>
                            ${student.year}
                        </div>

                        <div class="col-md-6 mt-2">
                            <strong>Semester:</strong>
                            ${student.semester}
                        </div>

                    </div>

                    <div class="table-responsive">

                        <table class="table table-bordered table-hover">

                            <thead class="table-dark">

                                <tr>
                                    <th>Sl No.</th>
                                    <th>Subject Name</th>
                                    <th>Subject Code</th>
                                    <th>Marks</th>
                                </tr>

                            </thead>

                            <tbody></tbody>

                        </table>

                    </div>

                </div>

            `;

            let tableBody = card.querySelector("tbody");

            student.subjects.forEach((subject, index) => {

                tableBody.innerHTML += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${subject.subject_name}
                        </td>

                        <td>
                            ${subject.subject_code}
                        </td>

                        <td>
                            ${subject.marks}
                        </td>

                    </tr>

                `;

            });

            container.appendChild(card);
            
        });
        DisplayData();

    } catch (error) {

        console.log(error);

    }

}

let prevBtn = document.getElementById('prevBtn')
let nextBtn = document.getElementById('nextBtn')


let index=0
let count=0
let cardPerPage=3
let TotalPage=0
let allCard=[];

function DisplayData() {
    allCard=document.querySelectorAll('.allCard')
    count=0
     while (index<=allCard.length-1 && count<cardPerPage) {
        allCard[index].classList.remove('d-none')
        allCard[index].classList.add('d-block')
        count++
        index++
     }
    TotalPage++
    document.getElementById('pageInfo').innerText=`Page ${TotalPage}`
}


nextBtn.addEventListener('click', () => {
    if (index<0) {
        index++
    }
    if (index >= allCard.length) {
        alert("No More Data Available");
        return;
    }
    let btncount = 0;
    let nextIndex = index - cardPerPage;
    
    while (btncount < cardPerPage && nextIndex < index) {
        if (allCard[nextIndex]) {
            allCard[nextIndex].classList.remove('d-block');
            allCard[nextIndex].classList.add('d-none');
        }
        nextIndex++;
        btncount++;
    }

    DisplayData();

});


prevBtn.addEventListener('click', () => {
    TotalPage--
    document.getElementById('pageInfo').innerText=`Page ${TotalPage}`
    index = index - 1;
    let count1 = 0;

    while (allCard[index] && allCard[index].classList.contains("d-block")) {

        allCard[index].classList.remove('d-block');
        allCard[index].classList.add('d-none');

        index--;
    }

    if (index < 0) {
       index=0
        alert("No Previous Data Available");
        DisplayData()
        return
    }

    index = index - cardPerPage + 1;

    while (count1 < cardPerPage && allCard[index]) {

        allCard[index].classList.remove('d-none');
        allCard[index].classList.add('d-block');
        
        index++;
        console.log(index)
        count1++;
    }
});