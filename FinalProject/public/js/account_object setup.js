const newsTable = document.querySelector('.news > table > tbody');
const sportsTable = document.querySelector('.sports > table > tbody');
const emergencyTable = document.querySelector('.emergency > table > tbody');
const eventsTable = document.querySelector('.events > table > tbody')
const annoucementsTable = document.querySelector('.annoucements > table > tbody')


auth.onAuthStateChanged(user => {
    if (user) {
        userId = user.uid;
        console.log(userId);
        fs.collection("articles")
            .onSnapshot((doc) => {
                articleSetup(user);
                eventSetup(user)
            });

        fs.collection("events")
            .onSnapshot((doc) => {

                eventSetup(user)
            });


    }
    else {
        console.log("user signed out");
        setupUI(user);
    }
});



//make function here pass to auth.js for user listener



const articleSetup = (user) => {

    var articlesRef = fs.collection("articles").where("authorUid", "==", user.uid).get().then((querySnapshot) => {

        var sportshtml = "";
        var newshtml = "";
        var emergencyhtml = "";
        var announcementshtml="";

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // build html to add here

            var date = new Date(doc.data().timestamp)
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();

            row = `    <tr name="${doc.id}">
                        <td>
                            <a href="/subhtml/articleView.html/?article=${doc.id}" style="display: block">                                  
                                <u>${doc.data().articleTitle}</u>
                            </a>
                        </td>
                        
                        <td> ${month}-${day}-${year}</td>
                        <td>
                            <a href="/subhtml/articleEdit.html/?article=${doc.id}" class=" waves-effect waves-white btn yellow darken-2 " 
                            data-tooltip="Edit Article">
                            <i class="material-icons white-text">edit</i></a>
                        </td>
                        <td>    
                            <a class=" waves-effect waves-white btn red lighten-2 delete">
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
        annoucementsTable.innerHTML = announcementshtml;

        console.log(document.querySelectorAll("div>table>tbody>tr>td>a.delete  "))
        document.querySelectorAll("div>table>tbody>tr>td>a.delete").forEach(elem => {

            elem.addEventListener('click', e => {
                e.preventDefault();
                console.log("clicked")
                id = elem.parentNode.parentNode.getAttribute("name");
                
                //article delete
                fs.collection("articles").doc(id).delete().then(() => {
                    //image delete

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

                });


            })
        })



    });
}

const eventSetup = (user) => {

    var articlesRef = fs.collection("events").where("authorUid", "==", user.uid).get().then((querySnapshot) => {

        var eventshtml = "";

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // build html to add here

            var date = new Date(doc.data().timestamp)
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();

            var startDate = new Date(doc.data().eventStartTimestamp)
            var startMonth = startDate.getMonth() + 1;
            var startDay = startDate.getDate();
            var startYear = startDate.getFullYear();

            var endDate = new Date(doc.data().eventEndStamp)
            var endYear = endDate.getFullYear();
            var endDay = endDate.getDate();
            var endMonth = endDate.getMonth() + 1;

            row = `    <tr name="${doc.id}">
                        <td>
                            <a href="/subhtml/eventView.html/?event=${doc.id}" style="display: block">                                  
                                <u>${doc.data().eventTitle}</u>
                            </a>
                        </td>
                        
                        <td> ${month}-${day}-${year}</td>
                        <td> ${startMonth}-${startDay}-${startYear}</td>
                        <td> ${endMonth}-${endDay}-${endYear}</td>
                        <td> ${doc.data().authorFirstName} ${doc.data().authorLastName}</td>
                        <td>
                            <a href="/subhtml/eventEdit.html/?event=${doc.id}" class="modal-close waves-effect waves-white btn yellow darken-2 " 
                            ">
                            <i class="material-icons white-text">edit</i></a>
                        </td>
                        <td>    
                            <a class="modal-close waves-effect waves-white btn red lighten-2 delete">
                            <i class="material-icons white-text">delete</i></a>
                        </td>
                    </tr>`

            eventshtml += row;


        });

        eventsTable.innerHTML = eventshtml;
        console.log(document.querySelectorAll("div.events >table>tbody>tr>td>a.delete"))
        document.querySelectorAll("div.events >table>tbody>tr>td>a.delete").forEach(elem => {

            elem.addEventListener('click', e => {
                e.preventDefault();
                console.log("clicked")
                id = elem.parentNode.parentNode.getAttribute("name");
                // M.Tooltip.getInstance(elem).destroy()
                //article delete
                fs.collection("events").doc(id).delete().then(() => {
                    //image delete

                    storage.ref().child("eventImages/" + id).listAll()
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

                });


            })
        })
    });
}