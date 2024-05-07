const eventMap = {
    'TemperatureExceedsMax': () => {
        console.log('executing TemperatureExceedsMax');
        return 0
    },
    'PeterErEnBozo': () => {
        console.log('executing PeterErEnBozo');
        return 0
    },
    'PatrickErEnBozo': () => {
        console.log('executing PatrickErEnBozo');
        return 0
    },
    'GustasErEnBozo': () => {
        console.log('executing GustasErEnBozo');
        return 0
    }
}


console.log(eventMap['TemperatureExceedsMax']()); // prints 0


module.exports = eventMap;