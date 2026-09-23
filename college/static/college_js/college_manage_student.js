const courseFilter=document.getElementById('courseFilter')
    courseFilter.addEventListener('change',()=>{
        const courseFilterValue=courseFilter.value;
        const rowValue=document.querySelectorAll('.rowValue')
        rowValue.forEach((row)=>{
            let rowdata=row.innerText;
            if (rowdata.includes(courseFilterValue)) {
                row.style.display=""
            }else{
                row.style.display="none"
            }
        })
});

document.querySelector('#studentSearch').addEventListener('input',()=>{
    const studentSearch=document.querySelector('#studentSearch').value.trim();
    const rowValue=document.querySelectorAll('.rowValue')
    rowValue.forEach((row)=>{
        const rowData=row.innerText;
        if (rowData.includes(studentSearch)) {
            row.style.display=""
        }else{
            row.style.display='none'
        }
    })
});

