const courseFilter = document.querySelector('#courseFilter');
const semesterFilter = document.querySelector('#semesterFilter');
const searchInput = document.querySelector('#searchInput')
courseFilter.addEventListener('change', DisplayData);
semesterFilter.addEventListener('change', DisplayData);
searchInput.addEventListener('input',DisplayData)

function DisplayData() {

    const courseFilterValue = courseFilter.options[courseFilter.selectedIndex].textContent.toLowerCase().trim();

    const semesterFilterValue = semesterFilter.options[semesterFilter.selectedIndex].textContent.toLowerCase().trim();
    const searchInputValue = searchInput.value.toLowerCase().trim();
    const dataRow = document.querySelectorAll('.dataRow');

    dataRow.forEach(row => {

        const tdValue = row.querySelectorAll('td');

        const courseName = tdValue[1].textContent.toLowerCase().trim();
        const rowText = row.innerText.toLowerCase();

        const courseMatch = courseFilterValue === "all courses" || courseName === courseFilterValue;

        const semesterMatch = semesterFilterValue === "all semesters" || rowText.includes(semesterFilterValue);
        const searchMatch = rowText.includes(searchInputValue)
        if (courseMatch && semesterMatch && searchMatch) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });
}