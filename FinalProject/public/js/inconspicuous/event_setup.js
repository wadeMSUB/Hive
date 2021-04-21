const eventsTable = document.querySelector('.events > table > tbody')

const inconspicuousEventSetup = (user) => {

    var articlesRef = fs.collection("events").get().then((querySnapshot) => {

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
                            <a href="/subhtml/eventEdit.html/?event=${doc.id}" style="display: block">                                  
                                <u>${doc.data().eventTitle}</u>
                            </a>
                        </td>
                        
                        <td> ${month}-${day}-${year}</td>
                        <td> ${startMonth}-${startDay}-${startYear}</td>
                        <td> ${endMonth}-${endDay}-${endYear}</td>
                        <td> ${doc.data().authorFirstName} ${doc.data().authorLastName}</td>
                        <td>
                        <a href="/subhtml/eventEdit.html/?event=${doc.id}" class="modal-close waves-effect waves-white btn yellow darken-2 " 
                        >
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
        console.log(eventsTable.querySelectorAll("a.delete"))
        eventsTable.querySelectorAll("a.delete").forEach(elem => {

            elem.addEventListener('click', e => {
                e.preventDefault();
                id = elem.parentNode.parentNode.getAttribute("name");
                console.log(id)
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