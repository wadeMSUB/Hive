const eventCreateForm = document.querySelector('#event-form');
M.Collapsible.init(document.querySelectorAll('.collapsible'), {
    accordion: false
});
const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);

const ev = urlParams.get('event')
console.log(ev);

//switch handling
const dateSwitch = document.querySelector('#multi-day-switch');
const endDateDiv = document.querySelector('#date-end-div');
const startDateDiv = document.querySelector('#date-start-div');

//grabbing html from editor for article body
var editor = CKEDITOR.replace('editor2');



dateSwitch.addEventListener('click', (e) => {
    switchStatus = dateSwitch.checked;
    if (dateSwitch.checked) {
        startDateDiv.className = "input-field col s12 m3 offset-m3";
        endDateDiv.style.display = "block";
        endDateDiv.attributes.required = true;



    } else {
        endDateDiv.style.display = "none";
        eventCreateForm['create-event-date-end'].value = "";
        startDateDiv.className = "input-field col s12 m6 offset-m3";
    }
});

var query = fs.collection("events").doc(ev)
var getOptions = {
    source: 'cache'
};
query.get().then(doc => {
    var body = doc.data().eventDescription;
    

    var startDate = new Date(doc.data().eventStartTimestamp)
    var startMonth = startDate.getMonth() + 1;
    var startDay = startDate.getDate();
    var startYear = startDate.getFullYear();
    var startAmPm = "AM";
    var startHour = startDate.getHours()
    console.log(startHour)
    if (startHour > 12) {
        startHour = (startHour - 12).toString();
        startAmPm = "PM"
    }
    var startMinute = startDate.getMinutes().toString()

    var endDate = new Date(doc.data().eventEndStamp)
    var endYear = endDate.getFullYear();
    var endDay = endDate.getDate();
    var endMonth = endDate.getMonth() + 1;
    var endAmPm = "AM";
    var endHour = endDate.getHours()
    console.log(endHour)
    if (endHour > 12) {
        endHour = (endHour - 12).toString();
        endAmPm = "PM"
    }
    console.log(endAmPm)

    var endMinute = endDate.getMinutes().toString();

    //upate form with query results

    eventCreateForm['create-event-title'].value = doc.data().eventTitle;
    eventCreateForm['create-event-location'].value = doc.data().eventLocation;

    //use materialize inits to add dates and times.

    console.log(startDay + startMonth + startYear)
    console.log(endDay + endMonth + endYear)
    if ((startDay + startMonth + startYear) != (endDay + endMonth + endYear)) {
        dateSwitch.checked = true;
        startDateDiv.className = "input-field col s12 m3 offset-m3";
        endDateDiv.style.display = "block";
        endDateDiv.attributes.required = true;

        M.Datepicker.init(document.querySelectorAll('#create-event-date-end'), {
            format: 'mm-dd-yyyy',
            defaultDate: endDate,
            setDefaultDate: true,
        })

    } 
    M.Datepicker.init(document.querySelectorAll('#create-event-date-start'), {
        format: 'mm-dd-yyyy',
        defaultDate: startDate,
        setDefaultDate: true,
    })




    M.Timepicker.init(document.querySelectorAll('#create-event-time-start'), {

        defaultTime: startHour + ":" + startMinute + startAmPm,
    })

    M.Timepicker.getInstance(document.querySelector('#create-event-time-start'))._updateTimeFromInput();
    M.Timepicker.getInstance(document.querySelector('#create-event-time-start')).done();


    M.Timepicker.init(document.querySelectorAll('#create-event-time-end'), {

        twelveHour: true,
        defaultTime: endHour + ":" + endMinute + endAmPm,
    });
    M.Timepicker.getInstance(document.querySelector('#create-event-time-end'))._updateTimeFromInput();
    M.Timepicker.getInstance(document.querySelector('#create-event-time-end')).done();

    //init chips with article chips
    let instances = M.Chips.init(document.querySelector('.chips'), {
        placeholder: "Add a tag",
        secondaryPlaceholder: "Add Another",
    })
    doc.data().eventChips.forEach(chip => {
        //add chip to search form chip instance.
        instances.addChip({
            tag: chip
        })
    })

    M.updateTextFields();

    CKEDITOR.instances.editor2.setData(body, function () { this.updateElement(); });


    var storageRef = storage.ref();
    var path = "eventImages/" + ev;
    var listRef = storageRef.child(path);
    listRef.listAll()
        .then((res) => {
            var modalHTMLarray = [];

            console.log()
            if (res.items.length > 0) {
                //document.querySelector('main > div.row > div.col').innerHTML = ` <div class="carousel carousel-slider grey valign-wrapper" style="max-height: 400px"></div>`
                res.items.forEach((itemRef) => {

                    modalHTMLarray.push(itemRef.getDownloadURL());
                })
                Promise.all(modalHTMLarray).then((results) => {

                    var imgTags = ``

                    results.forEach(url => {

                        //image setup
                        imgTags += `
                        <tr><td>
                        <img class=" materialboxed" width="50" height="auto" style="" src="${url}" > 
                        </td>
                        <td>
                        <a class="modal-close waves-effect waves-green btn red lighten-2 delete">
                                    <i class="material-icons white-text">delete</i>
                                </a>
                        </td></tr>
                        `
                        
                            
                            


                    });
                    console.log(imgTags)
                    //document.querySelector('.carousel').innerHTML = imgTags;
                    document.querySelector('.image-table').innerHTML += imgTags;
                    console.log(document.querySelectorAll("a.delete"))
                    document.querySelectorAll("a.delete").forEach(elem => {
                        console.log(elem.parentNode.parentNode.querySelector('td>img').src)
                        let url = elem.parentNode.parentNode.querySelector('td>img').src;
                        console.log(url)
                        elem.addEventListener('click', e => {
                            e.preventDefault();
                            confirm("This action is permanent.");
                            storage.refFromURL(url).delete().then(()=>{
                                window.location.replace(window.location.href)
                            })
                            
                           
            
                        })
                    })


                    




                    var elems = document.querySelectorAll('.materialboxed');
                    M.Materialbox.init(elems, {
                        overlayActive: true,
                    });




                });
            }

        });





});




console.log(eventCreateForm.querySelector('.error'))





//ckeditor reset
const discardEvent = eventCreateForm.querySelector('button[type=reset]');
discardEvent.addEventListener('click', (e) => {
    console.log("discarded");
    eventCreateForm.querySelector('.chips').querySelectorAll('.chip').forEach(ele => {
        ele.remove();
    })
    eventCreateForm.querySelector('.error').innerHTML = '';
    CKEDITOR.instances.editor2.setData("", function () { this.updateElement(); });

    window.location.reload()


});



eventCreateForm.addEventListener('submit', (e) => {
    eventCreateForm.querySelector('.error').innerHTML = '';
    e.preventDefault();
    var eventData = CKEDITOR.instances.editor2.getData();
    var errors = "";
    //chip data
    let chips = M.Chips.getInstance(eventCreateForm.querySelector('.chips')).chipsData
    console.log(chips)

 
    //chipHandler() is defined in article_create.js
    var chipArray = chipHandler(chips);
    console.log(chipArray)

    // set doesn't return a promise reference of the doc created
    // so a reference is created before set is called and used for 
    // image storage path
    var eventRef = fs.collection('events').doc(ev);
    var f = eventCreateForm.querySelector('input[type=file]')

    //input start date to date dict with int values
    var startDate = dateDictGet(eventCreateForm['create-event-date-start'].value);
    var endDate; //variable declared but not defined until later

    //time variables as a dictionary of hours and minutes with int values
    var startTime = timeGet(eventCreateForm['create-event-time-start'].value);
    console.log("start time from form input "+eventCreateForm['create-event-time-start'].value)
    var endTime = timeGet(eventCreateForm['create-event-time-end'].value);
    console.log("end time from form input "+eventCreateForm['create-event-time-start'].value)

    // unix timestamp of start date + time as an int for comaparison and query ordering
    console.log(startTime["minutes"])
    var startStamp = toTimestamp(startDate['year'], startDate['month'], startDate['day'], startTime['hours'], startTime['minutes']);
    var endStamp //variable declared but not defined until later

    if (!eventCreateForm['create-event-date-end'].value) {
        //single day event tree
        //endStamp set to the same date if single day event with endTime values added
        endStamp = toTimestamp(startDate['year'], startDate['month'], startDate['day'], endTime['hours'], endTime['minutes']);

        try {
            //time span validity check
            timestampComparison(startStamp, endStamp);
        }
        catch (err) {
            //add to a div at the top of form
            console.log(err);
            eventCreateForm.querySelector('.error').innerHTML = err;
            return;

        }

    }
    else {
        //multiple day event
        //endDate values taken from form
        endDate = dateDictGet(eventCreateForm['create-event-date-end'].value);
        //endStamp defined
        endStamp = toTimestamp(endDate['year'], endDate['month'], endDate['day'], endTime['hours'], endTime['minutes']);
        console.log(endStamp);

        try {
            //event date range check
            console.log("multiple day branch: " + endStamp + " " + startStamp);
            (timestampComparison(startStamp, endStamp));
        }
        catch (err) {
            //add to a div at the top of form
            console.log(err);
            eventCreateForm.querySelector('.error').innerHTML = err;
            return;
        }



    }

    //error throwing for body
    if (eventData == "") {
        errors += `<p>Invalid Field: Please add content to the article body.</p>`
    }
    try {
        if (!errors == "") {
            throw errors
        }
    }
    catch (err) {
        console.log(err);
        eventCreateForm.querySelector('.error').innerHTML = err;
        return;
    }



    var userRef = fs.collection("users").doc(auth.currentUser.uid);
    userRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            var lastName = capitalize(doc.data().lastName);
            var firstName = capitalize(doc.data().firstName);
            //var eventData = CKEDITOR.instances.editor2.getData();
            console.log(startStamp)
            console.log(endStamp)
            //begin post to database
            eventRef.update({
                eventChips: chipArray,

                eventTitle: eventCreateForm['create-event-title'].value,

                eventLocation: eventCreateForm['create-event-location'].value,

                eventStartTimestamp: startStamp,

                eventEndStamp: endStamp,

                eventDescription: eventData,

                //Author info and metadata
                authorLastName: lastName,
                authorFirstName: firstName,
                authorUid: auth.currentUser.uid,
                dateModified: Date.now(), //to be used in edit page

            }).then(() => {
                console.log("file length "+f.files.length)
                //Chip adding
                let docRef = fs.collection('chips').doc('events');
                console.log(chipArray)

                docRef.update({
                    values: firebase.firestore.FieldValue.arrayUnion.apply(null, chipArray)
                })


                //eventCreateForm.reset();
                let elems = eventCreateForm.querySelector('.chips')
                let chipsLength = elems.querySelectorAll('.chip').length;



                for (i = 0; i < chipsLength; i++) {
                    M.Chips.getInstance(elems).deleteChip(0);
                }





                console.log(M.Chips.getInstance(eventCreateForm.querySelector('.chips')).chipsData)
                console.log(eventCreateForm.querySelector('.chips').querySelectorAll('.chip'))

                console.log("create event promise then");
                
                
                if (f.files.length != 0) {
                    console.log("files size not zero")
                    Array.from(f.files).forEach(item => {
                        console.log(item.name)
                        console.log(eventRef.id)
                        
                        //filepath to cloud storage
                        var storageRef = storage.ref()
                        storageRef.child('eventImages/' + eventRef.id + '/'+item.name).put(item).then(()=>{
                            //refreshing before put is executed kills the put
                            alert("Event Updated with files.")
                            window.location.replace(window.location.href)
                        });
                        //console.log(storageRef)
                        //storageRef.put(item);
                    });

                }else {
                    alert("Event Updated.")
                            window.location.replace(window.location.href)

                }

                

            }).catch(err => {
                console.log("create error");
                console.log(err.message)
            });

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    //set doesn't return a promise reference of the doc created




})



