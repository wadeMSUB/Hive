
var news = "";
var sports = "";
var emergency = "";
var announcements = "";

const sportsDiv = document.querySelector('#sports');
const newsDiv = document.querySelector('#news');
const emergencyDiv = document.querySelector('#emergency');
const announcementsDiv = document.querySelector('#announcements');

function weekStart(){
    const currentDate= new Date;
    var offset = currentDate.getUTCDay();
    var offsetToMs = offset*86400000;
    var nearSunInMs = currentDate-offsetToMs-currentDate.getHours()*3600000-currentDate.getMinutes()*60000-currentDate.getSeconds()*1000-currentDate.getUTCMilliseconds();
    return nearSunInMs;
}
console.log(weekStart());

var articlesRef = fs.collection("articles").where("timestamp",">=",weekStart()).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // build html to add here
        
        var date = new Date(doc.data().timestamp)
        var month = date.getMonth()+1;
        var day = date.getDate();
        var year = date.getFullYear();

        var html = `<li class="collection-item article" name='${doc.id}'>
                        <div class="row">
                                          
                                <div class="col s12 m6 l6 ">
                                    <a href="/subhtml/articleView.html/?article=${doc.id}" style="display: block">
                                  
                                        <u>${doc.data().articleTitle}</u>
                                        <br>
                                        <br> 

                                    </a>
                                </div>  
                                <div class="col s12 m3 l2">    
                                    
                                    Publsihed on: ${month}-${day}-${year}
                                </div>   
                                <div class="col s12 m3 l2">
                                    Author: ${doc.data().authorFirstName} ${doc.data().authorLastName}
                                </div>
                                
                                                            
                        </div>
                        <ul class="collapsible z-depth-0">
                            <li>
                                <div class="collapsible-header"><i class="material-icons">camera_roll</i>Preview Images
                                </div>
                                <div class="collapsible-body">
                                    <div class="image-wrap" style="display: flex !important; flex-wrap: wrap !important;">                            
                                    </div>                                
                                </div>
                            </li>                            
                        </ul>                                               
                    </li>`


        if (doc.data().catMajor == "sports") {

            sports += html;

            html = "";
        } else if (doc.data().catMajor == "news") {
            news += html;

            html = ""
        }
        else if (doc.data().catMajor == "emergency") {
            emergency += html;

            html = ""
        }
        else if (doc.data().catMajor == "announcements") {
            announcements += html;

            html = ""
        }




    });

    sportsDiv.innerHTML = sports;
    announcementsDiv.innerHTML = announcements;
    newsDiv.innerHTML = news;
    emergencyDiv.innerHTML = emergency;

    var list = document.querySelectorAll("li.article >ul > li> div.collapsible-body>div.image-wrap");
    console.log(list)
    list.forEach(article => {
        var storageRef = storage.ref();
        var path = "articleImages/" + article.parentNode.parentNode.parentNode.parentNode.getAttribute("name");
        var listRef = storageRef.child(path);
        listRef.listAll()
            .then((res) => {
                var modalHTMLarray = [];
                res.items.forEach((itemRef) => {

                    modalHTMLarray.push(itemRef.getDownloadURL());
                })
                Promise.all(modalHTMLarray).then((results) => {

                    var links = ``
                    results.forEach(url => {
                        links += `
                                        <img class=" materialboxed" width="50" height="auto" style="" src="${url}" > 
                                    `
                    });
                    article.innerHTML = links;
                    console.log(links);



                    var elems = document.querySelectorAll('.collapsible');
                    M.Collapsible.init(elems, {
                      accordion: false
                    });
                  
                  
                    var elems = document.querySelectorAll('.materialboxed');
                    M.Materialbox.init(elems, {
                      overlayActive: true,
                    });


                   

                });
                
            });

    });



});


var events = "";


const eventsDiv = document.querySelector('#events');



var eventsRef = fs.collection("events").where("timestamp",">=",weekStart()).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // build html to add here
        //timestamp conversion to readable date
        var startDate = new Date(doc.data().eventStartTimestamp)
        var startMonth = startDate.getMonth() +1;
        var startDay = startDate.getDate();
        var startYear = startDate.getFullYear();

        var endDate = new Date(doc.data().eventEndStamp)
        var endYear = endDate.getFullYear();
        var endDay = endDate.getDate();
        var endMonth  = endDate.getMonth() +1;







        events += `<li class="collection-item event" name='${doc.id}'>
                        <div class="row">
                                          
                                <div class="col s12 m3 l6 ">
                                    <a href="/subhtml/eventView.html/?event=${doc.id}" style="display: block">
                                  
                                        <u>${doc.data().eventTitle}</u>
                                        <br>
                                        <br> 

                                    </a>
                                </div>  
                                <div class="col s12 m3 l2">    
                                    
                                    Start date: ${startMonth}-${startDay}-${startYear}
                                </div>
                                <div class="col s12 m3 l2">    
                                    
                                    Ends date: ${endMonth}-${endDay}-${endYear}
                                </div>    
                                <div class="col s12 m3 l2">
                                    Author: ${doc.data().authorFirstName} ${doc.data().authorLastName}
                                </div>
                                
                                                            
                        </div>
                        <ul class="collapsible z-depth-0">
                            <li>
                                <div class="collapsible-header"><i class="material-icons">camera_roll</i>Preview Images
                                </div>
                                <div class="collapsible-body">
                                    <div class="image-wrap" style="display: flex !important; flex-wrap: wrap !important;">                            
                                    </div>                                
                                </div>
                            </li>                            
                        </ul>                                               
                    </li>`


        




    });
    eventsDiv.innerHTML = events;
   

    var list = document.querySelectorAll("li.event >ul > li> div.collapsible-body>div.image-wrap");
    console.log(list)
    list.forEach(event => {
        var storageRef = storage.ref();
        var path = "eventImages/" + event.parentNode.parentNode.parentNode.parentNode.getAttribute("name");
        var listRef = storageRef.child(path);
        listRef.listAll()
            .then((res) => {
                var modalHTMLarray = [];
                res.items.forEach((itemRef) => {

                    modalHTMLarray.push(itemRef.getDownloadURL());
                })
                Promise.all(modalHTMLarray).then((results) => {

                    var links = ``
                    results.forEach(url => {
                        links += `
                                        <img class=" materialboxed" width="50" height="auto" style="" src="${url}" > 
                                    `
                    });
                    event.innerHTML = links;
                    console.log(links);



                    var elems = document.querySelectorAll('.collapsible');
                    M.Collapsible.init(elems, {
                      accordion: false
                    });
                  
                  
                    var elems = document.querySelectorAll('.materialboxed');
                    M.Materialbox.init(elems, {
                      overlayActive: true,
                    });


                   

                });
                
            });

    });



});