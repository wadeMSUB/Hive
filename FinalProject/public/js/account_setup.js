const accountEditForm = document.querySelector("#user-edit-form");
const accountDetails = document.querySelector("#account-form");
const passwordInputDivs = document.querySelectorAll(".switch-target");
const passwordInputs = document.querySelectorAll('input[type=password]');
var switchStatus;

//edit listener
auth.onAuthStateChanged(user => {
    if(user){
        userId = user.uid;
        console.log(userId);
        
        fs.collection('users').doc(user.uid).onSnapshot(snapshot => {
            console.log("auth change snapshot branch");
            setupAccount(user);
        })
        
    }
    else{
    console.log("user signed out");
    
    }
});


//Updates modal and readonly form for account

const setupAccount = (user) => fs.collection('users').doc(user.uid).get().then(doc => {
    

    accountDetails['readonly-first-name'].value = doc.data().firstName;
    accountDetails['readonly-last-name'].value = doc.data().lastName;    
    accountDetails['readonly-department'].value = doc.data().dept;
    accountDetails['readonly-email'].value = doc.data().email;

    

    accountEditForm['first-name'].value = doc.data().firstName;
    accountEditForm['last-name'].value = doc.data().lastName;
    accountEditForm['department'].value = doc.data().dept;
    accountEditForm['email'].value = doc.data().email;

    M.updateTextFields();

    
    // const html = `
    // <div>Logged in as ${user.email}</div>
    // <div>${doc.data().department}</div>
    // `;
    // accountDetails.innerHTML = html;
})

//switches status for password inputs
const passwordSwitch = document.querySelector('#change-password-switch');



passwordSwitch.addEventListener('click',(e)=>{
    console.log(passwordSwitch.checked);
    switchStatus = passwordSwitch.checked;
    if(passwordSwitch.checked){
        console.log(passwordInputDivs);
        passwordInputDivs.forEach(item=> item.style.display="block");
        passwordInputs.forEach(item => item.disabled = false);

    }else{
        passwordInputDivs.forEach(item=> item.style.display="none");
        passwordInputs.forEach(item => item.disabled = true);
    }
})