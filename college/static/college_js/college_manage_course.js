const emptyRow=document.querySelector('#emptyRow')

document.getElementById('search').addEventListener('input',()=>{
    let search_value=document.getElementById('search').value.toLowerCase().trim();
    const courseRows=document.querySelectorAll('.courseRows');
    let found=false;
    courseRows.forEach(row => {
        let rowValue = row.innerText.toLowerCase();
        if (rowValue.includes(search_value)) {
            row.style.display=""
            found=true;
        }else{
            row.style.display="none"
        }
    });
    if (found) {
    emptyRow.style.display="none"
    }else{
    emptyRow.style.display=""
    }

})

