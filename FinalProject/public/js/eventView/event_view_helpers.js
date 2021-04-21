const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);

const ev = urlParams.get('event')
console.log(ev);

var query = fs.collection("events").doc(ev)
var getOptions = {
    source: 'cache'
};
query.get().then(doc => {
    var publishDate = new Date(doc.data().timestamp)
    
        var publishMonth = publishDate.getMonth() +1;
        var publishDay = publishDate.getDate();
        var publishYear = publishDate.getFullYear();
        console.log(`${publishMonth}-${publishDay}-${publishYear}`);

    var startDate = new Date(doc.data().eventStartTimestamp)
        var startMonth = startDate.getMonth() +1;
        var startDay = startDate.getDate();
        var startYear = startDate.getFullYear();
        var startHour = startDate.getHours();
        var startHourStr="";
        var startMinutes= startDate.getMinutes();
        var startMinutesStr = "";
        if(startHour > 12){
            startHour = startHour%12
            startHourStr = startHour.toString()
            tod="PM"
        }else{
            startHourStr=startHour.toString()
            tod="AM"
        }
        if(startMinutes==0){
            startMinutesStr = "00"
        }

        var endDate = new Date(doc.data().eventEndStamp)
        var endYear = endDate.getFullYear();
        var endDay = endDate.getDate();
        var endMonth  = endDate.getMonth() +1;
        var endHour = endDate.getHours();
        var endHourStr="";
        var endMinutes= endDate.getMinutes();
        var endMinutesStr = "";
        var tod = "";

        if(endHour > 12){
            endHour = endHour%12
            endHourStr = endHour.toString()
            tod="PM"
        }else{
            endHourStr=endHour.toString()
            tod="AM"
        }
        if(endMinutes==0){
            endMinutesStr = "00"
        }
        console.log(`End date: ${endMonth}-${endDay}-${endYear}`);
    document.querySelector('#event-title').innerHTML = `<u>${doc.data().eventTitle}</u>`
    document.querySelector('#event-start-timestamp').innerHTML = `Start date: ${startMonth}-${startDay}-${startYear} at ${startHourStr}:${startMinutesStr}${tod}`;
    document.querySelector('#event-end-timestamp').innerHTML = `End date: ${endMonth}-${endDay}-${endYear} at ${endHourStr}:${endMinutesStr}${tod}`;
    document.querySelector('#event-published').innerHTML = `Published on: ${publishMonth}-${publishDay}-${publishYear}`;    
    document.querySelector('#event-author').innerHTML = `Author: ${doc.data().authorFirstName} ${doc.data().authorLastName}`;
    document.querySelector('#event-body').innerHTML = doc.data().eventDescription;

    let chips = ``;
    doc.data().eventChips.forEach(chip => {
        chips += `<div class="chip">${chip}</div>`
    })

    document.querySelector('#event-minor').innerHTML = chips;



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
                        

                        imgTags+=`<li class="container">
                        <img class="" src="${url}">
                        <div class="caption center-align">
                          
                        </div>
                      </li>`
                        
                        
                    });
                    console.log(imgTags)
                    //document.querySelector('.carousel').innerHTML = imgTags;
                    document.querySelector('.slides').innerHTML += imgTags;


                    M.Slider.init(document.querySelectorAll('.slider'), {
                        interval: 36000000
                    });


                    M.Carousel.init(document.querySelectorAll('.carousel'), {
                        fullwidth:true,
                        
                        duration: 100,
                    });


                    var elems = document.querySelectorAll('.materialboxed');
                    M.Materialbox.init(elems, {
                        overlayActive: true,
                    });




                });
            }

        });





});