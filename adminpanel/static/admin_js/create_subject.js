
const addSubjectBtn =
        document.getElementById("addSubjectBtn");
const subjectContainer =
        document.getElementById("subjectContainer");

/* ADD NEW SUBJECT */

addSubjectBtn.addEventListener("click", function () {

        const subjectRows =
            document.querySelectorAll(".subject-row");

        const newNumber =
            subjectRows.length + 1;


        const newRow =
            document.createElement("div");


        newRow.className =
            "subject-row border rounded-3 p-3 mb-3 bg-light";


        newRow.innerHTML = `

            <div class="row g-3 align-items-end">


                <!-- Serial -->

                <div class="col-lg-1 col-md-2 col-12">

                    <label class="form-label fw-semibold">
                        No.
                    </label>

                    <div class="subject-number form-control bg-white text-center fw-bold">
                        ${newNumber}
                    </div>

                </div>


                <!-- Subject Name -->

                <div class="col-lg-3 col-md-5 col-12">

                    <label class="form-label fw-semibold">

                        Subject Name
                        <span class="text-danger">*</span>

                    </label>

                    <input type="text"
                           name="subject_name[]"
                           class="form-control"
                           placeholder="Enter subject name"
                           maxlength="100"
                           required>

                </div>


                <!-- Subject Type -->

                <div class="col-lg-2 col-md-5 col-12">

                    <label class="form-label fw-semibold">

                        Subject Type
                        <span class="text-danger">*</span>

                    </label>

                    <select name="subject_type[]"
                            class="form-select"
                            required>

                        <option value="">
                            -- Select Type --
                        </option>

                        <option value="theory">
                            Theory
                        </option>

                        <option value="lab">
                            Lab
                        </option>

                    </select>

                </div>


                <!-- Paper Choice -->

                <div class="col-lg-2 col-md-5 col-12">

                    <label class="form-label fw-semibold">

                        Paper
                        <span class="text-danger">*</span>

                    </label>

                    <select name="paper_choice[]"
                            class="form-select"
                            required>

                        <option value="">
                            -- Select Paper --
                        </option>

                        <option value="major">
                            Major
                        </option>

                        <option value="minor">
                            Minor
                        </option>

                    </select>

                </div>


                <!-- Paper Code -->

                <div class="col-lg-2 col-md-5 col-12">

                    <label class="form-label fw-semibold">

                        Paper Code
                        <span class="text-danger">*</span>

                    </label>

                    <input type="text"
                           name="paper_code[]"
                           class="form-control"
                           placeholder="Paper Code"
                           maxlength="10"
                           required>

                </div>


                <!-- Remove -->

                <div class="col-lg-2 col-md-2 col-12">

                    <button type="button"
                            class="btn btn-outline-danger w-100 remove-subject">

                        <i class="bi bi-trash me-1"></i>
                        Remove

                    </button>

                </div>


            </div>

        `;


        subjectContainer.appendChild(newRow);


        updateSubjectNumbers();

    });


    /* =====================================================
       REMOVE SUBJECT
    ====================================================== */

    subjectContainer.addEventListener("click",function (event) {

            const removeButton =
                event.target.closest(".remove-subject");


            if (!removeButton) {
                return;
            }


            const row =
                removeButton.closest(".subject-row");


            row.remove();


            updateSubjectNumbers();

        }
    );


    /* =====================================================
       UPDATE SERIAL NUMBERS
    ====================================================== */

    function updateSubjectNumbers() {

        const rows =
            document.querySelectorAll(".subject-row");


        rows.forEach(function (row, index) {

            const number =
                row.querySelector(".subject-number");


            number.textContent =
                index + 1;

        });


        /*
        If only one row exists,
        disable remove button.
        */

        const removeButtons =
            document.querySelectorAll(".remove-subject");


        if (removeButtons.length === 1) {

            removeButtons[0].disabled = true;

        } else {

            removeButtons.forEach(function (button) {

                button.disabled = false;

            });

        }

    }


    /* RESET FORM */

    document.querySelector("form").addEventListener(
        "reset",
        function () {

            setTimeout(function () {

                const rows =
                    document.querySelectorAll(".subject-row");


                /*
                Keep only first row
                */

                rows.forEach(function (row, index) {

                    if (index > 0) {
                        row.remove();
                    }

                });


                updateSubjectNumbers();

            }, 0);

        }
    );

