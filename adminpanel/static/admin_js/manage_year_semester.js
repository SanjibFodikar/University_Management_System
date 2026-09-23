
document.addEventListener("input", function () {

    const searchInput = document.getElementById("yearSemesterSearch");

    const clearButton = document.getElementById("clearSearch");

    const rows = document.querySelectorAll(".year-semester-row");

    const noSearchResult = document.getElementById("noSearchResult");


    searchInput.addEventListener("input", function () {

        const searchValue = searchInput.value.toLowerCase().trim();

        let found = false;


        rows.forEach(function (row) {

            const rowValue = row.innerText.toLowerCase();


            if (rowValue.includes(searchValue)) {

                row.style.display = "";

                found = true;

            } else {

                row.style.display = "none";

            }

        });


        if (!found && searchValue !== "") {

            noSearchResult.style.display = "block";

        } else {

            noSearchResult.style.display = "none";

        }

    });


    clearButton.addEventListener("click", function () {

        searchInput.value = "";


        rows.forEach(function (row) {

            row.style.display = "";

        });


        noSearchResult.style.display = "none";

        searchInput.focus();

    });

});

