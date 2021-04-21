const cleanup = document.querySelector("#clean-up");

cleanup.addEventListener('click', (e) => {
    e.preventDefault();



    const promises = [];
    promises.push(articleChips())
    //promises.push(articleMain())
    promises.push(eventChips())
    console.log(promises)


    Promise.all(promises).then(results => {
        //compare and update

        console.log(results)
        console.log(results[0])


        console.log(results[0]["news"])

        Object.keys(results[0]).forEach(key => {
            arr = results[0]



            var docRef = fs.collection('chips').doc(key);

            docRef.update({
                values: arr[key]
            })
        })
        Object.keys(results[1]).forEach(key => {
            arr = results[1]



            var docRef = fs.collection('chips').doc(key);

            docRef.update({
                values: arr[key]
            })
        })

    })




})

//return a promise of dict of value of catminors in article collection
function articleChips() {

    return new Promise(resolve => {
        var articleChipsDict = { "news": [], "sports": [], "emergency": [], "announcements": [] };

        fs.collection("articles").get().then(snapshot => {

            const articlePromises = [];

            snapshot.forEach(doc => {
                return new Promise((resolve) => {
                    var major = doc.data().catMajor;

                    var minor = doc.data().catMinor;



                    resolve(articlePromises.push([major, minor]))

                })



            });
            console.log(articlePromises)
            Promise.all(articlePromises).then(results => {
                console.log(results)
                console.log(results[0][0])




                results.forEach(result => {
                    console.log(result[0])
                    console.log(articleChipsDict[result[0]])
                    console.log(result[1])
                    articleChipsDict[result[0]] = articleChipsDict[result[0]].concat(result[1])


                })
                resolve(articleChipsDict)



            })



        })


    })
}

function eventChips() {

    return new Promise(resolve => {
        var eventChipsDict = { "events": [] };

        fs.collection("events").get().then(snapshot => {

            const eventPromises = [];

            snapshot.forEach(doc => {
                return new Promise((resolve) => {

                    var minor = doc.data().eventChips;



                    resolve(eventPromises.push(["events", minor]))

                })



            });

            Promise.all(eventPromises).then(results => {





                results.forEach(result => {
                    eventChipsDict[result[0]] = eventChipsDict[result[0]].concat(result[1])


                })
                resolve(eventChipsDict)



            })



        })


    })
}

//return a promise of dict with value present in chips docs
// function articleMain() {

//     return new Promise(resolve => {
//         var aMainDict = { "news": [], "sports": [], "emergency": [] };
//         fs.collection("chips").get().then(snapshot => {

//             snapshot.forEach(doc => {
//                 if (doc.id != "events") {
//                     aMainDict[doc.id].push(doc.data().values)
//                     aMainDict[doc.id] = aMainDict[doc.id].flat()

//                 }
//             })
//             resolve(aMainDict)


//         })

//     })
// }
// function sleep(time) {
//     return new Promise((resolve) => setTimeout(resolve, time));
// }