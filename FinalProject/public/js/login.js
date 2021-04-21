//Login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener('submit',(e) =>{
    e.preventDefault();

    //Get user creds
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    //Logging in
    auth.signInWithEmailAndPassword(email,password).then(cred =>{
        
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        
    });
});