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