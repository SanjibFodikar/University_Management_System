const searchInput = document.getElementById("collegeSearch");
const clearSearch = document.getElementById("clearSearch");
const collegeRows = document.querySelectorAll(".college-row");
const noSearchResult = document.getElementById("noSearchResult");

searchInput.addEventListener('input',()=>{
let visibleRows=0
const searchValue=searchInput.value.toLowerCase().trim()
collegeRows.forEach(row => {
const row_value=row.innerText.toLowerCase();
        if (row_value.includes(searchValue)) {
            row.style.display = "";
            visibleRows++
        } else {
            row.style.display = "none";
        }
    });

    if (visibleRows === 0 && searchValue !== "") {
        noSearchResult.style.display = "block";
    } else {
        noSearchResult.style.display = "none";
    }
});

clearSearch.addEventListener('click',()=>{
    collegeRows.forEach(row=>{
        row.style.display = "";
        noSearchResult.style.display = "none";
    })
});