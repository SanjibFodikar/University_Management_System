function number_validate(id) {
    valid=true
    let inputValue=Number(document.getElementById(id).value);
    let errorBox=document.getElementById(id+"_error_box")
    if (inputValue>25 || inputValue<0) {
        errorBox.innerHTML=`<strong class='text-danger'>Marks should be in between 0 - 25<strong/>`;
        valid=false
    }else{
        errorBox.innerHTML=""
        valid=true
    }
    return valid
}
function subjectValidate() {
    let marksInputs = document.querySelectorAll('.marksinput');
    let is_valid = true;
    marksInputs.forEach(e => {
        if (e.value.trim() === '') {
            is_valid = false;
        }
    });

    if (is_valid) {
        console.log("All marks entered");
    } else {
        console.log("Some marks are missing");
    }
    return is_valid;
}


let rowindex = 0;
let rows = document.querySelectorAll('.studentrows');
let rowlength = rows.length;

function stepbystep() {
    if (rowindex < rowlength) {
        if (rowindex != 0) {
            rows[rowindex - 1].style.display = "none";
        }
        rows[rowindex].style.display = "block";
        rowindex++;
        document.getElementById('studentCount').innerText = rowindex;
    } else {
        rows[rowindex-1].style.display = "none";
        alert("Your marks for all students added successfully");
    }
}


document.getElementById('next').addEventListener('click', (e) => {
    e.preventDefault();

    if (!subjectValidate()) {
        alert("please enter all subjects Marks");
        return;
    }

    // current student

    let currentStudent = rows[rowindex - 1];

    let studentId = currentStudent.dataset.studentId;

    // form 
    let form = document.getElementById('myform');
    let formData = new FormData(form);

    // add student id
    formData.set("student_id", studentId);
    formData.set("saveMarks", "1");

    // ajax
    fetch(form.action, {
        method: "POST",
        body: formData,   
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    })

    .then(a => a.json())
    .then(data => {

        if (data.success) {
            console.log("Marks saved successfully");

            document.querySelectorAll('.marksinput').forEach(e => {
                e.value = "";
            });

            stepbystep();
        } else {
            alert(data.message);
        }

    })

    .catch(error => {

        console.error(error);

        alert("Something went wrong while saving marks.");

    });

});


stepbystep();