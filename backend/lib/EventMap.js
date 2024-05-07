const eventMap = {
    'TemperatureExceedsMax': () => {
        console.log('executing TemperatureExceedsMax');
        return 0
    }
}


console.log(eventMap['TemperatureExceedsMax']()); // prints 0
