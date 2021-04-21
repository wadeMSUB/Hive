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





//Getting the autocomplete chip dictionary
fs.collection("chips").doc('events').get().then(doc => {
    console.log(doc.data().values)
    concatChipArray = [];
    

    (()=>{
        return new Promise((resolve) => {
            console.log(doc.data().values)
            //pushes promise from one document with array of chips
            resolve(concatChipArray.push(doc.data().values));

        });
    })();
   


    Promise.all(concatChipArray).then(() => {

        console.log(concatChipArray)


        // create dictionary for autocopmlete
        console.log(chipDict)
        doc.data().values.forEach(ele => {
            console.log(chipDict[ele])
            chipDict[ele] = null;
        })

        // set up autocomplete for search form chips
        var searchElems = searchForm.querySelectorAll('.chips');
        console.log("chip dict for modal " + chipDict)
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

            M.Chips.init(chipForm.querySelectorAll('.chips'), {});

            var instances = M.Chips.getInstance(chipForm.querySelector('.chips'))

            modalDict = chipDict;
            for (var key in modalDict) {
                console.log("chip add")

                console.log(modalDict[key])
                instances.addChip({
                    tag: modalDict[key],
                    image: ''
                })
            }


            for (var key in modalDict) {
                instances.addChip({
                    tag: key,
                    image: ''
                })


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


