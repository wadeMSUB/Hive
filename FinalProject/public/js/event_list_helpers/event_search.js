
const resultsLi = document.querySelector('#search-results')
const liWithResults = document.querySelector('#li-with-results')
var searchFormLi = document.querySelectorAll("#search-form-li");
//get form data
searchForm.addEventListener('submit', e => {
    e.preventDefault();

    M.Collapsible.getInstance(document.querySelector(".collapsible")).close(0)

    //parse input fields
    let chips = M.Chips.getInstance(searchForm.querySelector('.chips')).chipsData;
    var chipArray = chipHandler(chips);

    var query = fs.collection("events")

    console.log(searchForm['search-published'].value != "")
    if (searchForm['search-published'].value != "") {
        dateDict = dateDictGet(searchForm['search-published'].value);
        
        var date = new Date(Date.UTC(dateDict['year'], dateDict['month'] - 1, dateDict['day'], 0, 0)).getTime() / 1000;
        console.log(date)
        query = query.where("timestamp", ">=", date)


    }


    console.log(chipArray.length > 0)
    if (chipArray.length > 0) {
        query = query.where("eventChips", "array-contains-any", chipArray)
    }
    console.log(searchForm['search-title'].value != "")
    if (searchForm['search-title'].value != "") {
        query = query.where("eventTitle", "==", searchForm['search-title'].value)
    }
    console.log(searchForm['search-last-name'].value != "")
    if (searchForm['search-last-name'].value != "") {
        query = query.where("authorLastName", "==", capitalize(searchForm['search-last-name'].value));

    }
    console.log(searchForm['search-first-name'].value != "")
    if (searchForm['search-first-name'].value != "") {
        query = query.where("authorFirstName", "==", capitalize(searchForm['search-first-name'].value));

    }


    query = query.orderBy("timestamp", "desc")

    query.get().then(snapshot => {
        var resultsCollapsible = document.querySelector("#search-results-li");
        resultsCollapsible.classList.add('active');


        liWithResults.style.display = 'block';

        var resultsHtml = "";
        snapshot.forEach(doc => {
            var startDate = new Date(doc.data().eventStartTimestamp)
            var startMonth = startDate.getMonth() + 1;
            var startDay = startDate.getDate();
            var startYear = startDate.getFullYear();

            var endDate = new Date(doc.data().eventEndStamp)
            var endYear = endDate.getFullYear();
            var endDay = endDate.getDate();
            var endMonth = endDate.getMonth() + 1;


            var html = `<li class="collection-item result" name='${doc.id}'>
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
                        
                        End date: ${endMonth}-${endDay}-${endYear}
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
            resultsHtml += html






        });
        resultsLi.innerHTML = resultsHtml;

        var list = document.querySelectorAll("li.result >ul > li> div.collapsible-body>div.image-wrap");
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

});