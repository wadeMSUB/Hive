function timeGet(value) {


    var time;
    var timeSplit = value.split(" ");
    var timeIntSplit = timeSplit[0].split(':')
    
    var hours;
    var minutes = parseInt(timeIntSplit[1]);
    
    if (timeSplit[1] == "AM") {
        hours = parseInt(timeIntSplit[0]);
    } else if (timeSplit[1] == "PM") {
        hours = (parseInt(timeIntSplit[0])%12 + 12);
        console.log(hours)
    }
    time = { 'hours': hours, "minutes": minutes };
    console.log(time);

    return time;


}
function timestampComparison(startTime, endTime) {

    if (endTime <= startTime) {
        throw "The event end time must occur after the even start time."
    }
}

function toTimestamp(year, month, day, hour, minute) {
    var d = new Date();
    var n = d.getTimezoneOffset()
    console.log(n)
    let timezone=n/60;
    
    
    
    var datum = new Date(Date.UTC(year, month - 1, day, hour+timezone, minute));
    
    
    return datum.getTime() ;
}