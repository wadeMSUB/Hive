const editAccountModal = document.querySelector("#modal-user-edit");

accountEditForm.addEventListener('submit', (e) => {
    e.preventDefault();


    if (switchStatus) {
        if (accountEditForm['login-password'].value == accountEditForm['login-password-confirm'].value) {

            console.log(accountEditForm['login-password'].value);
            auth.currentUser.updatePassword(accountEditForm['login-password'].value)
                .then(function () {
                    updateUser(accountEditForm);
                    // Update successful.
                    console.log('success with pass')
                }).catch(err => {
                    accountEditForm.querySelector('.error').innerHTML = err.message;
                    console.log(err.message)
                });
        } else {
            accountEditForm.querySelector('.error').innerHTML = "Passwords did not match.";

        }

    } else {
        updateUser(accountEditForm);
        console.log('success without pass')
    };
});

updateUser = (form) => {
    fs.collection('users').doc(auth.currentUser.uid).set({
        firstName: form['first-name'].value,
        lastName: form['last-name'].value,
        email: form['email'].value,
        dept: form['department'].value
    }).then(() => {
        M.Modal.getInstance(editAccountModal).close();
        accountEditForm.querySelector('.error').innerHTML = '';
        console.log("edit account promise received");
        //close modal


    }).catch(err => {
        console.log("edit error branch");
        console.log(err.message)
    });
}

// const passwordSwitch = document.getElementById('change-password-switch');

// passwordSwitch.addEventListener('click',(e)=>{
//     console.log(passwordSwitch.checked);
// })