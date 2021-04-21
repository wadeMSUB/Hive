const articleCreateForm = document.querySelector("#article-form");
M.Collapsible.init(document.querySelectorAll('.collapsible'), {
    accordion: false
  });

const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);

const article = urlParams.get('article')
console.log(article);

var query = fs.collection("articles").doc(article)
//unused
var getOptions = {
    source: 'cache'
};

query.get().then(doc => {
    // format time
    
  


    //update form
    articleCreateForm['create-title'].value = doc.data().articleTitle
    //document.querySelector('#article-timestamp').innerHTML = `Published on: ${month}-${day}-${year}`;

    articleCreateForm['create-major-category'].value = `Category: ${capitalize(doc.data().catMajor)}`
    //document.querySelector('option.selected').removeAttribute('selected');
    console.log(document.querySelectorAll('option'))
    document.querySelectorAll('option').forEach(elem=>{
        console.log(elem)
        console.log(elem.value)
        if(elem.value==doc.data().catMajor){
            elem.selected= true;
            console.log(elem)
            M.FormSelect.init(document.querySelectorAll('select'), {});
        }
        
    })

    //document.querySelector(`option value='${doc.data().catMajor}'`).setAttribute('selected',true)

    
    articleCreateForm['create-author-last'].value = doc.data().authorLastName;
    articleCreateForm['create-author-first'].value = doc.data().authorFirstName;
    //document.querySelector('#article-body').innerHTML = doc.data().articleBody;

    CKEDITOR.instances.editor1.setData(doc.data().articleBody, function () { this.updateElement(); });

    //init chips with article chips
    let instances = M.Chips.init(document.querySelector('.chips'),{
        placeholder: "Add a tag",
        secondaryPlaceholder: "Add Another",
    })
    doc.data().catMinor.forEach(chip => {
        //add chip to search form chip instance.
        instances.addChip({
            tag: chip
        })
    })

    M.updateTextFields();



    var storageRef = storage.ref();
    var path = "articleImages/" + article;
    var listRef = storageRef.child(path);
    listRef.listAll()
        .then((res) => {
            var modalHTMLarray = [];

            
            if (res.items.length > 0) {

                
                //document.querySelector('main > div.row > div.col').innerHTML = ` <div class="carousel carousel-slider grey valign-wrapper" style="max-height: 400px"></div>`
                res.items.forEach((itemRef) => {

                    modalHTMLarray.push(itemRef.getDownloadURL());
                })
                Promise.all(modalHTMLarray).then((results) => {

                    var imgTags = ``;
                    
                    results.forEach(url => {


                        imgTags +=  `
                        <tr><td>
                        <img class=" materialboxed" width="50" height="auto" style="" src="${url}" > 
                        </td>
                        <td>
                        <a class="modal-close waves-effect waves-green btn red lighten-2 delete">
                                    <i class="material-icons white-text">delete</i>
                                </a>
                        </td></tr>
                            `
                        //imgTags += `  <a class="carousel-item" href="#${i.toString()}!"><img tyle='height: 100%; width: auto; object-fit: contain' class="" src="${url}"></a>
                        //        `
                      
                    });
                    //console.log(imgTags)
                    //document.querySelector('.carousel').innerHTML = imgTags;
                    document.querySelector('.image-table').innerHTML += imgTags;

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


                    M.Slider.init(document.querySelectorAll('.slider'), {
                        interval: 36000000
                    });


                  
                    var elems = document.querySelectorAll('.materialboxed');
                    M.Materialbox.init(elems, {
                        overlayActive: true,
                    });




                });
            }

        });





});

articleCreateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // reset error div as it will get populated again. clears old errors on successful submit
    articleCreateForm.querySelector('.error').innerHTML = '';
    //set doesn't return a promise reference of the doc created
    // so a reference is created before set is called and used for 
    //image storage path
    var articleRef = fs.collection('articles').doc(article);

    var f = articleCreateForm.querySelector('input[type=file]')
    var data = CKEDITOR.instances.editor1.getData();

    // format to get chip data as input
    //M.Chips.getInstance(document.querySelector('.chips')).chipsData[0]['tag']
    let chips = M.Chips.getInstance(articleCreateForm.querySelector('.chips')).chipsData
    var chipArray = chipHandler(chips);

    //error handling
    var errors = "";

    if (articleCreateForm['create-major-category'].value == "") {
        errors += `<p> Invalid Field: Please select a "Major Category"</P> `
    }
    if (data == "") {
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


    //set doesn't return a promise reference of the doc created
    articleRef.update({
        articleTitle: articleCreateForm['create-title'].value,

        catMajor: articleCreateForm['create-major-category'].value,
        catMinor: chipArray,

        authorLastName: capitalize(articleCreateForm['create-author-last'].value),
        authorFirstName: capitalize(articleCreateForm['create-author-first'].value),

        articleBody: data,
        authorUid: auth.currentUser.uid,


        dateModified: Date.now(), 
        //timestamp: Date.now()


    }).then(() => {
        var docRef = fs.collection('chips').doc(articleCreateForm['create-major-category'].value);

        docRef.update({
            values: firebase.firestore.FieldValue.arrayUnion.apply(null, chipArray)
        })

        if (f.files.length != 0) {

            Array.from(f.files).forEach(item => {
                console.log(item)
                var storageRef = storage.ref()
                 storageRef.child('articleImages/' + articleRef.id + '/' + item.name).put(item).then(()=>{
                    //refreshing before put is executed kills the put
                    alert("Article Updated with files.")
                    window.location.replace(window.location.href)
                });
               
            });

        } else {
            alert("Article updated.")
            window.location.replace(window.location.href)
        }


        //adding potential new chips to chip database
        //have to add rules to allow logged in users the right to update


        // //article reset
        // articleCreateForm.reset();

        // //old chip removal
        // let elems = articleCreateForm.querySelector('.chips')
        // let chipsLength = elems.querySelectorAll('.chip').length;



        // for (i = 0; i < chipsLength; i++) {
        //     M.Chips.getInstance(elems).deleteChip(0);
        // }

        // CKEDITOR.instances.editor1.setData("", function () { this.updateElement(); });

       

        //console.log("create article promise then");
    }).catch(err => {
        console.log("create error");
        console.log(err.message)
    });



})

//grabbing html from editor for article body
var editor = CKEDITOR.replace('editor1');


// //ckeditor reset
const discard = articleCreateForm.querySelector('button[type=reset]');
discard.addEventListener('click', (e) => {
    console.log("clicked");
    articleCreateForm.querySelector('.chips').querySelectorAll('.chip').forEach(ele => {
        ele.remove();
    })
    articleCreateForm.querySelector('.error').innerHTML = '';
    //set value to empty str and update element.
    CKEDITOR.instances.editor1.setData("", function () { this.updateElement(); });

    window.location.reload();

});