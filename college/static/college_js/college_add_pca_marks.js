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



let currentStudent=""
let index=0
function getStudent() {
    let studentrows=document.querySelectorAll('.studentrows')
    if (studentrows.length>0) {
        
        if (studentrows.length === index) {
            alert("All Marks Inserted Successfully")
            returntudent_id
        }
        
        if (index==0) {
            studentrows[index].style.display="block"
            currentStudent=studentrows[index]
            document.getElementById('studentCount').innerText=index+1
            index++
            return
        }
        
        studentrows[index-1].style.display="none"
        studentrows[index].style.display="block"
        currentStudent=studentrows[index]
        index++
        document.getElementById('studentCount').innerText=index
        
    }
}

document.getElementById('next').addEventListener('click',(e)=>{
    e.preventDefault()
    if (!checkAllMarks()) {
        alert("please enter marks")
        return
    }
   
    let form=document.getElementById('myform')
    let formData=new FormData(form)
    let studentId = currentStudent.dataset.studentId
    formData.set("student_id", studentId)
    formData.set("saveMarks", "1");
    fetch(form.action,{
        method:"POST",
        body:formData,
        headers:{
            "X-Requested-With":"XMLHttpRequest"
        }
    })
    .then(a=>a.json())
    .then(data=>{
        if (data.success) {
            console.log(data)
            getStudent()
        }else{
            alert(data.message || "Marks could not be saved")
        }
    })
    .catch(error=>{
        console.log(error)
        alert("something went wrong")
    })

})

function checkMarks(id) {
    let marks=document.getElementById(id).value
    let valid=true
    if (marks>25 || marks<0) {
        document.getElementById(id+"_error_box").innerHTML=`<strong class="text-danger">Marks Should be in between 0-25</strong>`
        valid=false
    }else{
        document.getElementById(id+"_error_box").innerHTML=`<strong class="text-danger"></strong>`
        valid=true
    }
    return valid
}

function checkAllMarks() {
    let marksInputs = document.querySelectorAll('.marksinput');

    let valid = true;

    marksInputs.forEach(input => {

        if (input.value.trim() === "") {
            valid = false;
        }
        if (input.value.trim()>25) {
            valid = false;
        }
        if (input.value.trim()<0) {
            valid = false;
        }

    });

    return valid;
}

getStudent()