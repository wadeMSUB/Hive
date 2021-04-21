const usersTable = document.querySelector('.users > table > tbody')
const editAccountModal = document.querySelector("#modal-user-edit");
const accountEditForm = document.querySelector("#user-edit-form");
const passwordInputDivs = document.querySelectorAll(".switch-target");
const passwordInputs = document.querySelectorAll('input[type=password]');
var switchStatus;

const inconspicuousUsersSetup = () => {

    var articlesRef = fs.collection("users").get().then((querySnapshot) => {

        var html = "";

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // build html to add here         

            row = `    <tr name="${doc.id}">
                        <td>
                            ${doc.data().dept}
                        </td>
                        
                        <td> ${doc.data().lastName}</td>
                        <td> ${doc.data().firstName}</td>
                        <td> ${doc.data().email}</td>

                    <td>
                        <a href="" class="modal-close waves-effect waves-white btn yellow darken-2 modal-trigger edit" 
                        data-target="modal-user-edit">
                        <i class="material-icons white-text">edit</i></a>
                    </td>    
                    <td>    
                        <a class="modal-close waves-effect waves-white btn red lighten-2 delete">
                        <i class="material-icons white-text">delete</i></a>
                    </td>
                    </tr>`

            html += row;


        });

        usersTable.innerHTML = html;

       usersTable.querySelectorAll(" a.delete").forEach(elem => {

            elem.addEventListener('click', e => {
                e.preventDefault();
                id = elem.parentNode.parentNode.getAttribute("name");
                
                fs.collection("users").doc(id).delete().then(() => {})
        })
        });

        usersTable.querySelectorAll(" a.edit").forEach(elem => {

            elem.addEventListener('click', e => {
                e.preventDefault();
                id = elem.parentNode.parentNode.getAttribute("name");
                setupAccount(id)
                
                
        })




      
    });

    
});




const setupAccount = (id) => fs.collection('users').doc(id).get().then(doc => {  
    console.log(doc.data())
    console.log(doc.id)
    accountEditForm['uid'].value = doc.id;
    accountEditForm['first-name'].value = doc.data().firstName;
    accountEditForm['last-name'].value = doc.data().lastName;
    accountEditForm['department'].value = doc.data().dept;
    accountEditForm['email'].value = doc.data().email;

    M.updateTextFields();

    

})


}

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
    console.log(form['uid'].value)
    fs.collection('users').doc(form['uid'].value).set({
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

/* <td>
                        <a href="" class="modal-close waves-effect waves-white btn yellow darken-2 modal-trigger edit" 
                        data-target="modal-user-edit">
                        <i class="material-icons white-text">edit</i></a>
                    </td> */