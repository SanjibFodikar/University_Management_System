function validate_profile() {

    let valid = true;

    const email = document.getElementById("college_email").value.trim();
    const phone = document.getElementById("phone_number").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const district = document.getElementById("district").value.trim();
    const state = document.getElementById("state").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const director = document.getElementById("director_name").value.trim();

    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {

        document.getElementById("email_error").innerHTML =
            `<strong class="text-danger">
                Please enter college email
            </strong>`;

        valid = false;

    } else if (!email_pattern.test(email)) {

        document.getElementById("email_error").innerHTML =
            `<strong class="text-danger">
                Please enter a valid email
            </strong>`;

        valid = false;
    }


    const phone_pattern = /^[0-9]{10}$/;

    if (phone === "") {

        document.getElementById("phone_number_error").innerHTML =
            `<strong class="text-danger">
                Please enter phone number
            </strong>`;

        valid = false;

    } else if (!phone_pattern.test(phone)) {

        document.getElementById("phone_number_error").innerHTML =
            `<strong class="text-danger">
                Phone number must contain 10 digits
            </strong>`;

        valid = false;
    }


    if (address === "") {

        document.getElementById("address_error").innerHTML =
            `<strong class="text-danger">
                Please enter address
            </strong>`;

        valid = false;
    }


    if (city === "") {

        document.getElementById("city_error").innerHTML =
            `<strong class="text-danger">
                Please enter city
            </strong>`;

        valid = false;
    }

    if (district === "") {

        document.getElementById("district_error").innerHTML =
            `<strong class="text-danger">
                Please enter district
            </strong>`;

        valid = false;
    }


    if (state === "") {

        document.getElementById("state_error").innerHTML =
            `<strong class="text-danger">
                Please enter state
            </strong>`;

        valid = false;
    }

    const pincode_pattern = /^[0-9]{6}$/;

    if (pincode === "") {

        document.getElementById("pincode_error").innerHTML =
            `<strong class="text-danger">
                Please enter pincode
            </strong>`;

        valid = false;

    } else if (!pincode_pattern.test(pincode)) {

        document.getElementById("pincode_error").innerHTML =
            `<strong class="text-danger">
                Pincode must contain 6 digits
            </strong>`;

        valid = false;
    }
    const director_pattern = /^[A-Za-z\s.]+$/;

    if (director === "") {

        document.getElementById("director_name_error").innerHTML =
            `<strong class="text-danger">
                Please enter director name
            </strong>`;

        valid = false;

    } else if (!director_pattern.test(director)) {

        document.getElementById("director_name_error").innerHTML =
            `<strong class="text-danger">
                Please enter a valid director name
            </strong>`;

        valid = false;
    }

    return valid;
}

function validate_form(id) {
   const data=document.getElementById(id+"_error")
   const val=document.getElementById(id).value;
   if (val === ""){
      data.innerHTML=`<strong class="text-danger">
                Please enter ${id}
            </strong>`;
   }
   if(val != ""){
       if (data){
        data.innerHTML=""
      } 
   }
   
} 