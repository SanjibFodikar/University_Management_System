//  admin password eyeicon
 const password = document.getElementById("password");
    const eyeicon = document.getElementById("eyeicon");

    eyeicon.addEventListener('click', () => {
        if (password.type === 'password') {
            password.type = 'text'
            eyeicon.classList.remove('bi-eye')
            eyeicon.classList.add('bi-eye-slash')
        } else {
            password.type = 'password'
            eyeicon.classList.remove('bi-eye-slash')
            eyeicon.classList.add('bi-eye')
        }
    })

// admin validate

function validate() {

    let username = document.getElementById('Username').value;
    let password = document.getElementById('password').value;

    if (username.trim() == "") {

        document.getElementById('username_error').innerHTML =
            `<strong class="text-danger mt-2">
                Username should not be empty
             </strong>`;

        return false;
    }

    if (password.trim() == "") {

        document.getElementById('password_error').innerHTML =
            `<strong class="text-danger mt-2">
                Password should not be empty
             </strong>`;

        return false;
    }

    return true;
}
