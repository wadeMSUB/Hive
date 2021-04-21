function dateDictGet(value) {


    var dateIntDict = { "month": 0, "day": 0, "year": 0 };
    var dateSplit = value.split("-");

    dateSplit.forEach(s => {
        dateIntDict[Object.keys(dateIntDict)[dateSplit.indexOf(s)]] = parseInt(s);
    });
  
    return dateIntDict;


}

