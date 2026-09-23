// Search & Filter JavaScript
const searchInput = document.getElementById('teacherSearch');
const statusFilter = document.getElementById('statusFilter');
const rows = document.querySelectorAll('.teacher-row');


function filterTeachers() {

    const searchValue = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;

    rows.forEach(row => {

        const rowText = row.innerText.toLowerCase();
        const rowStatus = row.dataset.status;

        const searchMatch = rowText.includes(searchValue);

        const statusMatch =
            statusValue === 'all' ||
            rowStatus === statusValue;

        if (searchMatch && statusMatch) {

            row.style.display = '';

        } else {

            row.style.display = 'none';

        }

    });

}


searchInput.addEventListener('keyup', filterTeachers);

statusFilter.addEventListener('change', filterTeachers);


