
const loggedIn = document.querySelectorAll(".logged-in");
const loggedOut = document.querySelectorAll(".logged-out");
var userId = "";

auth.onAuthStateChanged(user => {
    if(user){
        userId = user.uid;
        console.log(userId);        
        setupUI(user);
        //articleSetup(user)
    }
    else{
    console.log("user signed out");
    setupUI(user);
    }
});



//Logout
const logout = document.querySelector('#logout');
logout.addEventListener('click',(e)=>{
    e.preventDefault();
    auth.signOut();
    window.location.replace("/");
})

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }