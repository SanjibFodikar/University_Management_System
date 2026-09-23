document.getElementById('course').addEventListener('change', getSubject);
document.getElementById('semester').addEventListener('change', getSubject);

function getSubject() {

    const course_id = document.getElementById('course').value;
    const semester_id = document.getElementById('semester').value;
    const tableBody = document.getElementById('tableBody');

    // Course or semester not selected
    if (!course_id || !semester_id) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    No Data Found
                </td>
            </tr>
        `;

        return;
    }

    fetch(`/college/fetch_college_subject/${course_id}/${semester_id}/`)
        .then(response => response.json())
        .then(data => {

            tableBody.innerHTML = "";

            if (data.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center">
                            No Data Found
                        </td>
                    </tr>
                `;
                return;
            }
            data.forEach((element, index) => {
                tableBody.innerHTML += `
                    <tr>

                        <td class="text-center">
                            ${index + 1}
                        </td>

                        <td>
                            ${element.subject_name}
                        </td>

                        <td>
                            <span class="badge bg-light text-dark border">
                                ${element.paper_code}
                            </span>
                        </td>

                        <td>
                            <span class="badge bg-primary">
                                ${element.subject_type}
                            </span>
                        </td>

                        <td>
                            <span class="badge bg-success">
                                ${element.paper_choice}
                            </span>
                        </td>

                        <td>
                            ${element.course_name}
                        </td>

                        <td>
                            ${element.year} - ${element.semester}
                        </td>

                    </tr>
                `;
            });
        });
}


// download button
document.getElementById("downloadBtn").addEventListener("click", function () {

    const table = document.querySelector("table");

    let csv = [];

    const rows = table.querySelectorAll("tr");

    rows.forEach(row => {

        const cols = row.querySelectorAll("th, td");

        let rowData = [];

        cols.forEach(col => {
            rowData.push('"' + col.innerText.trim().replace(/"/g, '""') + '"');
        });

        csv.push(rowData.join(","));
    });

    const blob = new Blob([csv.join("\n")], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "my_subjects.csv";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
});