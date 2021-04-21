const newsTable = document.querySelector('.news > table > tbody');
const sportsTable = document.querySelector('.sports > table > tbody');
const emergencyTable = document.querySelector('.emergency > table > tbody');
const announcementsTable = document.querySelector('.announcements > table > tbody');


auth.onAuthStateChanged(user => {
    if (user) {

        var usersRef = fs.collection('admins').doc(user.uid);



        usersRef.get()
            .then((doc) => {

                if (doc.exists) {
                    document.querySelector('.inconspicuous').style.display = 'block';

                    fs.collection("articles")
                        .onSnapshot(() => {
                            inconspicuousArticleSetup(user);
                        });
                    fs.collection("events")
                        .onSnapshot(() => {
                            inconspicuousEventSetup(user)
                        });
                    fs.collection("users")
                        .onSnapshot(() => {
                            inconspicuousUsersSetup();
                        });

                } else {
                    document.querySelector('.inconspicuous').style.display = 'none'
                }
            })

        userId = user.uid;




    }
    else {
        console.log("user signed out");
        setupUI(user);
    }
})




//make function here pass to auth.js for user listener



const inconspicuousArticleSetup = (user) => {

    var articlesRef = fs.collection("articles").get().then((querySnapshot) => {

        var sportshtml = "";
        var newshtml = "";
        var emergencyhtml = "";
        var announcementshtml = "";

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // build html to add here

            var date = new Date(doc.data().timestamp)
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();

            row = `    <tr name="${doc.id}" >
                        <td >
                            <a href="/subhtml/articleView.html/?article=${doc.id}" style="display: block">                                  
                                <u>${doc.data().articleTitle}</u>
                            </a>
                        </td>
                        
                        <td> ${month}-${day}-${year}</td>
                        <td>
                            <a href="/subhtml/articleEdit.html/?article=${doc.id}" class="modal-close waves-effect waves-white btn yellow darken-2 " 
                            >
                            <i class="material-icons white-text">edit</i></a>
                        </td>
                        <td>    
                            <a class="modal-close waves-effect waves-white btn red lighten-2 delete">
                            <i class="material-icons white-text">delete</i></a>
                        </td>
                    </tr>`

            if (doc.data().catMajor == "sports") {

                sportshtml += row;


            } else if (doc.data().catMajor == "news") {
                newshtml += row;


            }
            else if (doc.data().catMajor == "emergency") {
                emergencyhtml += row;


            }
            else if (doc.data().catMajor == "announcements") {
                announcementshtml += row;


            }

        });

        sportsTable.innerHTML = sportshtml;
        newsTable.innerHTML = newshtml;
        emergencyTable.innerHTML = emergencyhtml;
        announcementsTable.innerHTML = announcementshtml;

        console.log(document.querySelectorAll("div>table>tbody>tr>td>a.delete"))


        document.querySelectorAll("div>table>tbody>tr>td>a.delete").forEach(elem => {

            elem.addEventListener('click', e => {
                e.preventDefault();
                console.log("clicked")
                id = elem.parentNode.parentNode.getAttribute("name");
                console.log(id)
                // M.Tooltip.getInstance(elem).destroy()
                //article delete
                fs.collection("articles").doc(id).delete().then(() => {
                    //image delete

                    console.log("deleted")

                    storage.ref().child("articleImages/" + id).listAll()
                        .then((res) => {

                            res.items.forEach((itemRef) => {
                                console.log(itemRef.fullPath);
                                itemRef.delete().then(() => {
                                    console.log("image Deleted")
                                })

                            })
                            // alert("Document and associated images deleted.")
                            // window.location.reload();
                        }).catch(error => {
                            console.log(error)
                        })

                }).catch(error => {
                    console.log(error)
                });


            })
        })



    });
}

