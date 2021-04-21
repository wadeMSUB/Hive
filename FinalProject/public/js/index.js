

const setupUI = (user) => {
  if (user) {
    var usersRef = fs.collection('admins').doc(user.uid);


    usersRef.get()
      .then((doc) => {
        console.log(doc.exists)
        if (doc.exists) {
          document.querySelector('.inconspicuous').style.display = 'block'
        } else{
          document.querySelector('.inconspicuous').style.display = 'none'
        }
      })
  
 
    loggedIn.forEach(item => item.style.display = 'block');
    loggedOut.forEach(item => item.style.display = 'none')
  } else {
    loggedOut.forEach(item => item.style.display = 'block');
    loggedIn.forEach(item => item.style.display = 'none')
  }
}
 
// DOM Manipulation
document.addEventListener('DOMContentLoaded', function () {

  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, {});







  var elems = document.querySelectorAll('.datepicker');
  var instances = M.Datepicker.init(elems, {
    format: 'mm-dd-yyyy'
  });

  var elems = document.querySelectorAll('.timepicker');
  var instances = M.Timepicker.init(elems, {}
  );



  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems, {});

  var el = document.querySelector('.tabs');
  var instance = M.Tabs.init(el, {});

  var elems = document.querySelectorAll('.collapsible.expandable');
  var instances = M.Collapsible.init(elems, {
    accordion: false
  });


  var elems = document.querySelectorAll('.materialboxed');
  var instances = M.Materialbox.init(elems, {
    overlayActive: true,
  });

  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, {})



  var elems = document.querySelectorAll('.tooltipped');
  var instances = M.Tooltip.init(elems, {});

  var elems = document.querySelectorAll('.slider');
  var instances = M.Slider.init(elems, {});



});