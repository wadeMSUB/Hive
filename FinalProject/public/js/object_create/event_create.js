



const eventCreateForm = document.querySelector('#event-form');
console.log(eventCreateForm.querySelector('.error'))

//grabbing html from editor for article body
var editor = CKEDITOR.replace('editor2');





//ckeditor reset
const discardEvent = eventCreateForm.querySelector('button[type=reset]');
discardEvent.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("discarded");


    let elems = eventCreateForm.querySelector('.chips')
    let chipsLength = elems.querySelectorAll('.chip').length;



    for (i = 0; i < chipsLength; i++) {
        M.Chips.getInstance(elems).deleteChip(0);
    }



    M.Chips.init(document.querySelectorAll('.chips'), {
        placeholder: "Add a tag",
        secondaryPlaceholder: "Add Another",
      

    });

    

    eventCreateForm.querySelector('.error').innerHTML = '';

    CKEDITOR.instances.editor2.setData("", function () { this.updateElement(); });

    window.location.reload()
});



eventCreateForm.addEventListener('submit', (e) => {
    eventCreateForm.querySelector('.error').innerHTML = '';
    e.preventDefault();
    var errors = "";

    //chip data
    let chips = M.Chips.getInstance(eventCreateForm.querySelector('.chips')).chipsData
    console.log(chips)
    //chipHandler() is defined in article_create.js
    var chipArray = chipHandler(chips);
    var eventData = CKEDITOR.instances.editor2.getData();
    console.log(chipArray)

    // set doesn't return a promise reference of the doc created
    // so a reference is created before set is called and used for 
    // image storage path
    var eventRef = fs.collection('events').doc();
    var f = eventCreateForm.querySelector('input[type=file]')

    //input start date to date dict with int values
    var startDate = dateDictGet(eventCreateForm['create-event-date-start'].value);
    var endDate; //variable declared but not defined until later

    //time variables as a dictionary of hours and minutes with int values
    var startTime = timeGet(eventCreateForm['create-event-time-start'].value);
    var endTime = timeGet(eventCreateForm['create-event-time-end'].value);

    // unix timestamp of start date + time as an int for comaparison and query ordering
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
        articleCreateForm.querySelector('.error').innerHTML = err;
        return;
    }





    var userRef = fs.collection("users").doc(auth.currentUser.uid);
    userRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            var lastName = capitalize(doc.data().lastName);
            var firstName = capitalize(doc.data().firstName);
            console.log(firstName);
            console.log(lastName);
            //begin post to database
            eventRef.set({
                eventChips: chipArray,

                eventTitle: eventCreateForm['create-event-title'].value,
                eventLocation: eventCreateForm['create-event-location'].value,

                eventStartTimestamp: startStamp,
                eventEndStamp: endStamp,

                eventDescription: eventData,

                // eventDateStart: eventCreateForm['create-event-date-start'].value,
                // eventDateEnd: eventCreateForm['create-event-date-end'].value,

                // eventTimeStart: eventCreateForm['create-event-time-start'].value,
                // eventTimeEnd: eventCreateForm['create-event-time-end'].value,

                //Author info and metadata
                authorLastName: lastName,
                authorFirstName: firstName,
                authorUid: auth.currentUser.uid,
                //date_modified: dateTime, //to be used in edit page
                timestamp: Date.now()









            }).then(() => {

                if (f.files.length != 0) {

                    Array.from(f.files).forEach(item => {
                        //filepath to cloud storage
                        console.log(item.name)
                        var storageRef = storage.ref('eventImages/' + eventRef.id + '/' + item.name)
                        storageRef.put(item);
                    });

                }

                //Chip adding
                let docRef = fs.collection('chips').doc('events');
                console.log(chipArray)

                docRef.update({
                    values: firebase.firestore.FieldValue.arrayUnion.apply(null, chipArray)
                })


                eventCreateForm.reset();
                let elems = eventCreateForm.querySelector('.chips')
                let chipsLength = elems.querySelectorAll('.chip').length;



                for (i = 0; i < chipsLength; i++) {
                    M.Chips.getInstance(elems).deleteChip(0);
                }





                console.log(M.Chips.getInstance(eventCreateForm.querySelector('.chips')).chipsData)
                console.log(eventCreateForm.querySelector('.chips').querySelectorAll('.chip'))

                console.log("create event promise then");
                alert("Event submitted.")
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

//switch handling
const dateSwitch = document.querySelector('#multi-day-switch');
const endDateDiv = document.querySelector('#date-end-div');
const startDateDiv = document.querySelector('#date-start-div');


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