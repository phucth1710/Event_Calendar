$("#register_btn").click(function (e) {
    e.preventDefault();    
    const pathToPhpFile = 'signup.php'; 
    const fullname = $("#signup_fullname").val();
    const email = $("#signup_email").val();
    const username = $("#signup_username").val();
    const password = $("#signup_password").val();

    
    const data = { "username": username, "password": password, "email": email, "fullname": fullname};
    // console.log(data);
    

    fetch(pathToPhpFile, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(response => {
        if(response.success){
            $("#message").text("You've signed up!");
            $("#login_username").val("");
            $("#login_password").val("");
            $("#signup_fullname").val("");
            $("#signup_email").val("");
            $("#signup_username").val("");
            $("#signup_password").val("");
        }
        else{
            $("#message").text(`${response.message}`);
        }
        console.log(response.success ? "Please log in!" : `Sign Up Unsuccesfully: ${response.message}`)
    })
    .catch(err => console.error(err));
});