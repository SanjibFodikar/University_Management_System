function validate(){
    const username=document.querySelector('#username')
    const password=document.querySelector('#password')
    is_valid=true
    if (username.value.trim() === "") {
        const username_error=document.querySelector('#username_error')
        username_error.innerHTML=`<strong class="text-danger mt-3">Please Enter Username</strong>`;
        is_valid=false
    }
    return is_valid
}

document.querySelector('#username').addEventListener('input',()=>{
    document.querySelector('#username_error').innerHTML=""
})