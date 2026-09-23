document.getElementById("courseFilter")
    .addEventListener("change", loadSubjects);

document.getElementById("semesterFilter")
    .addEventListener("change", loadSubjects);


function loadSubjects() {

    const courseId =
        document.getElementById("courseFilter").value;

    const semesterId =
        document.getElementById("semesterFilter").value;

    const tableBody =
        document.getElementById("subjectTableBody");


    console.log("Course:", courseId);
    console.log("Semester:", semesterId);


    if (!courseId || !semesterId) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9"
                    class="text-center text-muted py-4">

                    Select Course and Semester

                </td>
            </tr>
        `;

        return;
    }


    fetch(
        `/adminpanel/ajax/manage-subject/${courseId}/${semesterId}/`
    )

    .then(response => response.json())

    .then(data => {

        console.log("Response:", data);

        tableBody.innerHTML = "";


        if (data.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="9"
                        class="text-center text-muted py-4">

                        <i class="bi bi-book display-6 d-block mb-2"></i>

                        No subject found.

                    </td>
                </tr>
            `;

            return;
        }


        data.forEach((subject, index) => {

            let subjectType = "";

            if (subject.subject_type === "theory") {

                subjectType = `
                    <span class="badge bg-primary">
                        <i class="bi bi-journal-text me-1"></i>
                        Theory
                    </span>
                `;

            } else if (subject.subject_type === "lab") {

                subjectType = `
                    <span class="badge bg-success">
                        <i class="bi bi-pc-display me-1"></i>
                        Lab
                    </span>
                `;

            }


            let paperType = "";

            if (subject.paper_type === "major") {

                paperType = `
                    <span class="badge bg-warning text-dark">
                        Major
                    </span>
                `;

            } else if (subject.paper_type === "minor") {

                paperType = `
                    <span class="badge bg-info text-dark">
                        Minor
                    </span>
                `;

            }


            tableBody.innerHTML += `

                <tr>

                    <!-- Serial -->

                    <td class="text-center fw-semibold">
                        ${index + 1}
                    </td>


                    <!-- Course -->

                    <td>
                        ${subject.course}
                    </td>


                    <!-- Year / Semester -->

                    <td>
                        Year ${subject.year}
                        -
                        Semester ${subject.semester}
                    </td>


                    <!-- Subject -->

                    <td>

                        <div class="d-flex align-items-center">

                            <div class="subject-icon me-2">

                                <i class="bi bi-book"></i>

                            </div>

                            <span class="fw-semibold">
                                ${subject.subject_name}
                            </span>

                        </div>

                    </td>


                    <!-- Paper Code -->

                    <td>

                        <span class="badge bg-success">
                            ${subject.paper_code}
                        </span>

                    </td>


                    <!-- Type -->

                    <td class="text-center">
                        ${subjectType}
                    </td>


                    <!-- Paper -->

                    <td class="text-center">
                        ${subject.paper_choice}
                    </td>


                    <!-- Created -->

                    <td class="text-center">

                        <small class="text-muted">
                            ${subject.created_date}
                        </small>

                    </td>


                    <!-- Action -->

                    <td class="text-center">

                        <div class="btn-group">

                            <a
                                href="/adminpanel/admin_edit_subject/${subject.id}/"
                                class="btn btn-sm btn-outline-primary">

                                <i class="bi bi-pencil-square"></i>
                                Edit
                            </a>


                            <a
                                href="/adminpanel/admin_delete_subject/${subject.id}/"
                                class="btn btn-sm btn-outline-danger" onclick="return confirm('Are You Sure To Delete Subject ?')">

                                <i class="bi bi-trash"></i>
                                Delete
                            </a>

                        </div>

                    </td>

                </tr>

            `;

        });

    })

    .catch(error => {

        console.error("AJAX Error:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="9"
                    class="text-center text-danger py-4">

                    <i class="bi bi-exclamation-triangle me-1"></i>
                    Failed to load subjects.

                </td>
            </tr>
        `;

    });

}