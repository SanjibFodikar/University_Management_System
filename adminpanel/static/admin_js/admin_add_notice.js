
// Description character counter

const description = document.getElementById("description");
const charCount = document.getElementById("charCount");

description.addEventListener("input", function () {

    charCount.textContent = this.value.length;

});


// Set today's date automatically

const noticeDate = document.getElementById("notice_date");

const today = new Date();

const year = today.getFullYear();

const month = String(today.getMonth() + 1).padStart(2, "0");

const day = String(today.getDate()).padStart(2, "0");

noticeDate.value = `${year}-${month}-${day}`;


// Reset character counter

document.getElementById("noticeForm").addEventListener("reset", function () {

    setTimeout(function () {

        charCount.textContent = "0";

        noticeDate.value = `${year}-${month}-${day}`;

    }, 0);

});

