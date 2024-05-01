const db = require('./database')

dbHandler = new db();

class eventHandler {

    subscribeToEvent(clientID, eventID){
        //call db function for adding event to client
    }

    unsubscribeToEvent(clientID, eventID) {
        //call db function for removing event from client
    }

    runSubbedEvents(clientID) {
        //subbedEvents = this.getSubbedEvents(clientID);
        //foreach event in subbedEvents{
            //find subscribed event
            //run event
        //}
    }

    getSubbedEvents(clientID){
        //const subbedEvents = Get subscribed events from client
        //return subbedEvents
    }


}





async function sensorType(clientID) {
    return await dbHandler.getSensorType(clientID); // Return the awaited value
}

async function createEvents(clientID) {
    const sensorObj = await sensorType(clientID);
    const eventMap = {
        'TemperatureExceedsMax': async (clientID) => {
            try {
                // Get all data from clients sensor
                await dbHandler.getAllClientSensorData(clientID).then((rows) => {
                    console.log(rows);
                    // Do something with data from clients sensor

                });
            } catch(err) {
                console.error(err.message);
            }

        }
    }

    Object.keys(eventMap).forEach((key) => dbHandler.createEvent(clientID, sensorObj.SensorType, key))
}

createEvents("8aed2fe1-06e3-4d69-89e9-44efce4dedf2");

//console.log(eventMap);
//console.log(eventMap.TemperatureExceedsMax("8aed2fe1-06e3-4d69-89e9-44efce4dedf2"));