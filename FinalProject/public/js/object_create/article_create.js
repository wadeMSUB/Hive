const articleCreateForm = document.querySelector("#article-form");


var elems = document.querySelectorAll('.chips');
var instances = M.Chips.init(elems, {
    placeholder: "Add a tag",
    secondaryPlaceholder: "Add Another",

});

//grabbing html from editor for article body
var editor = CKEDITOR.replace('editor1');


//ckeditor reset
const discard = articleCreateForm.querySelector('button[type=reset]');
discard.addEventListener('click', (e) => {
    console.log("discarded");
    e.preventDefault();
   
    let elems = articleCreateForm.querySelector('.chips')
    let chipsLength = elems.querySelectorAll('.chip').length;



    for (i = 0; i < chipsLength; i++) {
        M.Chips.getInstance(elems).deleteChip(0);
    }

  M.Chips.init(document.querySelectorAll('.chips'), {
        placeholder: "Add a tag",
        secondaryPlaceholder: "Add Another",
    
    });
    
    articleCreateForm.querySelector('.error').innerHTML = '';
    //set value to empty str and update element.
    CKEDITOR.instances.editor1.setData("", function () { this.updateElement(); });

});

function chipHandler(chips) {
    let chipArrayLocal = [];
    chips.forEach(c => {
        c['tag'] = c['tag'].toLowerCase();
        console.log();
        while (c['tag'][0] == ' ') {
            console.log(c['tag'] + " beginning space")
            c['tag'] = c['tag'].substr(1);
        }

        while (c['tag'][c['tag'].length - 1] == ' ') {
            console.log(c['tag'] + " danglling space")
            c['tag'] = c['tag'].substr(-1);
        }
        let cStr = c.tag.toString()
        chipArrayLocal.push(cStr)

        //if multiple word tags aren't allowed
        // try{
        //     if(cStr.includes(" ")){
        //         throw `Invalid Tag: <div class="chip">${c['tag']}</div> contains a space. Use two separate tags or a different tag all together. `
        //     }
        //     else{
        //         chipArray.push(cStr)                
        //     }
        // }
        // catch(err) {
        //     console.log(err);
        //     articleCreateForm.querySelector('.error').innerHTML = err;
        //     return;
        // }

    })
    return chipArrayLocal
}


articleCreateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // reset error div as it will get populated again. clears old errors on successful submit
    articleCreateForm.querySelector('.error').innerHTML = '';
    //set doesn't return a promise reference of the doc created
    // so a reference is created before set is called and used for 
    //image storage path
    var articleRef = fs.collection('articles').doc();

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
    articleRef.set({
        articleTitle: articleCreateForm['create-title'].value,

        catMajor: articleCreateForm['create-major-category'].value,
        catMinor: chipArray,

        authorLastName: capitalize(articleCreateForm['create-author-last'].value),
        authorFirstName: capitalize(articleCreateForm['create-author-first'].value),

        articleBody: data,
        authorUid: auth.currentUser.uid,


        //date_modified: dateTime, to be used with edit page
        timestamp: Date.now()


    }).then(() => {

        if (f.files.length != 0) {

            Array.from(f.files).forEach(item => {
                console.log(item)
                var storageRef = storage.ref('articleImages/' + articleRef.id + '/' + item.name)
                storageRef.put(item);
            });

        }


        //adding potential new chips to chip database
        //have to add rules to allow logged in users the right to update
        var docRef = fs.collection('chips').doc(articleCreateForm['create-major-category'].value);

        docRef.update({
            values: firebase.firestore.FieldValue.arrayUnion.apply(null, chipArray)
        })

        //article reset
        articleCreateForm.reset();

        //old chip removal
        let elems = articleCreateForm.querySelector('.chips')
        let chipsLength = elems.querySelectorAll('.chip').length;



        for (i = 0; i < chipsLength; i++) {
            M.Chips.getInstance(elems).deleteChip(0);
        }

        CKEDITOR.instances.editor1.setData("", function () { this.updateElement(); });
        alert("Article submitted.")

        //console.log("create article promise then");
    }).catch(err => {
        console.log("create error");
        console.log(err.message)
    });



})
