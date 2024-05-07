const eventMap = {
    'TemperatureExceedsMax': () => {
        console.log('executing TemperatureExceedsMax');
        return 0
    }
}


console.log(eventMap['TemperatureExceedsMax']()); // prints 0
/*
foreach event in subbedEvents{
    //find subscribed event

    if(eventMap[event]){
        //run event

        eventMap[event]();
    } else {
        console.log('Event not found');
    }

}
 */