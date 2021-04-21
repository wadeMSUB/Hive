const chipModal = document.querySelector('#modal-chip-select');
console.log(chipModal)

const chipForm = document.querySelector('#chip-select-form');
console.log(chipForm.querySelectorAll('.chips'))
const searchForm = document.querySelector('#search-form');
const chipAddButton = document.querySelector('.chip-add');
console.log(chipAddButton)



// create a const thats a flattened array of chips from db then add to auto complete of search form instance
var concatChipArray;
var sportsChips;
var emergencyChips;
var newsChips;
var chipDict = {};
var organizedDict = {}




//Getting the autocomplete chip dictionary
fs.collection("chips").get().then(docs => {
    concatChipArray = [];
    docs.forEach(doc => {

        return new Promise((resolve) => {
            organizedDict[doc.id] = doc.data().values;
            resolve(concatChipArray.push(organizedDict[doc.id]));
            //concatChipArray.push({doc.id: doc.data().values})
        });

    })
    Promise.all(concatChipArray).then(() => {
        //concatChipArray = results.flat()
        console.log(concatChipArray)
        console.log(organizedDict)

        // create dictionary for autocopmlete
        for (var key in organizedDict) {
            for (ele in organizedDict[key]) {

                chipDict[organizedDict[key][ele]] = null;
            }
        }
        console.log(chipDict)
        // concatChipArray.forEach(ele => {
        //     chipDict[ele] = null;
        // })
        // set up autocomplete for search form chips

        var searchElems = searchForm.querySelectorAll('.chips');
        M.Chips.init(searchElems, {
            placeholder: 'Enter a tag',
            secondaryPlaceholder: 'Add more tags',
            autocompleteOptions: {
                data: chipDict,
            }

        });

    })


});

//Manipulating the DOM to correctly add onOpenStart callback
document.addEventListener('DOMContentLoaded', function () {
    M.Modal.init(chipModal, {

        onOpenStart: function () {
            console.log(searchForm['search-major-category'].value)
            M.Chips.init(chipForm.querySelectorAll('.chips'), {});
            let modalDict;
            var instances = M.Chips.getInstance(chipForm.querySelector('.chips'))
            if (searchForm['search-major-category'].value != "") {
                modalDict = organizedDict[searchForm['search-major-category'].value];
                for (var key in modalDict) {
                    console.log("chip add")

                    console.log(modalDict[key])
                    instances.addChip({
                        tag: modalDict[key],
                        image: ''
                    })
                }
            } else {
                modalDict = chipDict;
                for (var key in modalDict) {
                    instances.addChip({
                        tag: key,
                        image: ''
                    })

                }
            }

            console.log(chipForm.querySelectorAll('.chip'))
            chipForm.querySelectorAll('.chip').forEach(chip => {
                chip.querySelector('i').remove();
                chip.removeAttribute("tabindex")

                //Mousedown and preventDefault prevents :focus
                //allows for proper stylings to be applied when 'selected'
                chip.addEventListener('mousedown', e => {
                    e.preventDefault();


                    if (!chip.classList.contains("selected")) {
                        chip.classList.add("selected")
                    } else {
                        chip.classList.remove("selected")
                    }
                });

            })
        },
        onOpenEnd: function () {

        },
        onCloseEnd: function () {
            chipForm.querySelectorAll('.chip')
        }


    })
});

// var eventsChips ;
// fs.collection("chips").doc("events").get().then(doc=>{

//     eventsChips = doc.data().values

// });









//function to populate modal
// chipAddButton.addEventListener('click', (e) => {
//     e.preventDefault();
//     M.Chips.init(chipForm.querySelectorAll('.chips'), {});
//     console.log(chipForm.querySelectorAll('.chips'))
//     let instances = M.Chips.getInstance(chipForm.querySelectorAll('.chips'))
//     while (!chipDict == {}) {
//         for (var key in chipDict) {
//             instances.addChip({
//                 tag: chipDict[key],
//                 image:''
//             })

//             // do something with "key" and "value" variables
//         }
//     }
//     // var chipPromiseList = [];
//     // let articlesRef = fs.collection("chips").get().then((querySnapshot) => {
//     //     querySnapshot.forEach((doc) => {
//     //         return new Promise((resolve) => {

//     //             resolve(chipPromiseList.push(doc.data().values));
//     //             console.log(doc.data().values)
//     //         });

//     //     });
//     //flatten, remove duplicates and add html from promise array values
//     //chipList is an array of arrays at this point
//     // Promise.all(chipPromiseList).then((results) => {


//     //     let chipsHtml = ``
//     //     results.flat().forEach((chip) => {


//     //         var chip = `
//     //         <div class="chip" tabindex="0">${chip}</div>
//     //         `
//     //         chipsHtml += chip;
//     //     })
//     //     chipForm.innerHTML = chipsHtml;
//     //     console.log(chipForm.querySelectorAll('.chip'))
//     //     chipForm.querySelectorAll('.chip').forEach(chip => {
//     //         //Mousedown and preventDefault prevents :focus
//     //         //allows for proper stylings to be applied when 'selected'
//     //         chip.addEventListener('mousedown', (e) => {
//     //             e.preventDefault();
//     //             if (!chip.classList.contains("selected")) {
//     //                 chip.classList.add("selected")
//     //             } else {
//     //                 chip.classList.remove("selected")
//     //             }
//     //         });
//     //     })



//     //     console.log(results.flat())

//     // });

// //});
// });

chipForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let instances = M.Chips.getInstance(searchForm.querySelector('.chips'))
    chipForm.querySelectorAll('.chip.selected').forEach(ele => {
        //add chip to search form chip instance.
        instances.addChip({
            tag: ele.innerHTML
        })
    })
    //close modal
    M.Modal.getInstance(chipModal).close()


})


