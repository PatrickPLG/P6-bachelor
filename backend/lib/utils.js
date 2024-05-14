function convertEpochToTime(epoch) {
    let date = new Date(epoch);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();

    // Will display time in HH:MM:SS format
    return hours + ':' + minutes.slice(-2) + ':' + seconds.slice(-2);
}

function getTimeString() {
    const time = new Date().getTime()
    return convertEpochToTime(time)
}

module.exports = {
    convertEpochToTime,
    getTimeString
}