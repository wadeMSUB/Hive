const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);

const article = urlParams.get('article')
console.log(article);

var query = fs.collection("articles").doc(article)
var getOptions = {
    source: 'cache'
};
query.get().then(doc => {

    var date = new Date(doc.data().timestamp)
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();

    document.querySelector('#article-title').innerHTML = `<u>${doc.data().articleTitle}</u>`
    document.querySelector('#article-timestamp').innerHTML = `Published on: ${month}-${day}-${year}`;
    document.querySelector('#article-major').innerHTML = `Category: ${capitalize(doc.data().catMajor)}`
    document.querySelector('#article-author').innerHTML = `Author: ${doc.data().authorFirstName} ${doc.data().authorLastName}`;
    document.querySelector('#article-body').innerHTML = doc.data().articleBody;
    let chips = ``;
    doc.data().catMinor.forEach(chip => {
        chips += `<div class="chip">${chip}</div>`
    })

    document.querySelector('#article-minor').innerHTML = chips;



    var storageRef = storage.ref();
    var path = "articleImages/" + article;
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
                    console.log(modalHTMLarray);
                    var imgTags = ``
                    let i = 1;
                    results.forEach(url => {
                        

                        imgTags+=`<li class="container">
                        <img class="" src="${url}"> <!-- random image -->
                        <div class="caption center-align">

                        </div>
                      </li>`
                        //imgTags += `  <a class="carousel-item" href="#${i.toString()}!"><img tyle='height: 100%; width: auto; object-fit: contain' class="" src="${url}"></a>
                        //        `
                        i++
                    });
                    
                    //document.querySelector('.carousel').innerHTML = imgTags;
                    if(imgTags!= ``){
                        console.log(imgTags);
                        document.querySelector('.slider-div').innerHTML+=`
                        <div class="slider" >
                            <ul class="slides valign-wrapper white" >                            
                            </ul>
                        </div>`;
                        document.querySelector('.slider').style.height='440px';
                        document.querySelector('.slides').style.height='400px';
                        document.querySelector('.slides').innerHTML += imgTags;}
                    else{
                        
                    }


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