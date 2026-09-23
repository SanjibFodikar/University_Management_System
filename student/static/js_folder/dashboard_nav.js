

const sidebar =
    document.getElementById("studentSidebar");

const sidebarToggle =
    document.getElementById("sidebarToggle");

const sidebarClose =
    document.getElementById("sidebarClose");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");


/* =====================================================
   OPEN SIDEBAR
===================================================== */

if (sidebarToggle) {

    sidebarToggle.addEventListener("click", function () {

        sidebar.classList.add("show");

        sidebarOverlay.classList.add("show");

    });

}


/* =====================================================
   CLOSE SIDEBAR - CROSS BUTTON
===================================================== */

if (sidebarClose) {

    sidebarClose.addEventListener("click", function () {

        sidebar.classList.remove("show");

        sidebarOverlay.classList.remove("show");

    });

}


/* =====================================================
   CLOSE SIDEBAR - OVERLAY
===================================================== */

if (sidebarOverlay) {

    sidebarOverlay.addEventListener("click", function () {

        sidebar.classList.remove("show");

        sidebarOverlay.classList.remove("show");

    });

}


document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        sidebar.classList.remove("show");

        sidebarOverlay.classList.remove("show");

    }

});

