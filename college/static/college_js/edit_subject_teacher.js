const course = document.querySelector('#course');
const semester=document.querySelector('#semester')
const subject = document.querySelector('#subject');
course.addEventListener('change',getSubject)
semester.addEventListener('change',getSubject)
function getSubject() {

    const course_id = course.value;
    console.log(course_id)
    const semester_id=semester.value;
    
    fetch(`/college/getSubject/${course_id}/${semester_id}/`)
        .then(a => a.json())
        .then(data => {

            subject.innerHTML = `
                <option value="">Select Subject</option>
            `;

            data.forEach(item => {

                subject.innerHTML += `
                    <option value="${item.id}">
                        ${item.subject_name}
                    </option>
                `;

            });

        });
}

getSubject();