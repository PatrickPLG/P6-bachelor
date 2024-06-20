const fs = require('fs');

function convertEpochToTime(epoch) {
    let date = new Date(epoch);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();

    // Will display time in HH:MM:SS format
    return hours + ':' + minutes.slice(-2);
}

function getTimeString() {
    const time = new Date().getTime()
    return convertEpochToTime(time)
}

function timeSinceFromString(timeString) { //format: 15:00
    const now = new Date().getTime()
    const time = new Date().setHours(timeString.split(':')[0], timeString.split(':')[1])

    //return string in format '15 minutes ago'
    return timeSince(time, now)
}

function timeSince(time, now) {
    const seconds = Math.floor((now - time) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) {
        return "last seen " + Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return "last seen " + Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return "last seen " + Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return "last seen " + Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return "last seen " + Math.floor(interval) + " minutes ago";
    }
    return "last seen " + Math.floor(seconds) + " seconds ago";
}


// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

module.exports = {
    convertEpochToTime,
    getTimeString,
    timeSinceFromString,
    base64_encode
}