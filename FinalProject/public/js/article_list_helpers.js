
var news = "";
var sports = "";
var emergency = "";
var announcements = "";

const sportsDiv = document.querySelector('#sports');
const newsDiv = document.querySelector('#news');
const emergencyDiv = document.querySelector('#emergency');
const announcementsDiv = document.querySelector('#announcements');

var articlesRef = fs.collection("articles").get().then((querySnapshot) => {
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
                                    
                                    Published on: ${month}-${day}-${year}
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