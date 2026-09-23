const course=document.querySelector('#course')
const subjectContainer = document.querySelector('#subject');
course.addEventListener('change',()=>{
    const course_id=course.value;
    subjectContainer.innerHTML = `
        <option value="">Select Subject</option>
    `;

    if (!course_id) {
        return;
    }
    fetch(`/college/get_subject/${course_id}/`)
    .then(a=>a.json())
    .then(data=>{
         data.forEach(subject => {
            console.log(subject)
            subjectContainer.innerHTML+=`
               <option value="${ subject.id }">
                    ${ subject.subject_name } - ${subject.paper_code} - ${subject.paper_type}
                </option>
            `;
         });
    })
})