const eventMap = require("./lib/EventMap");


class EventHandler {
    constructor(db) {
        this.eventMap = eventMap
        this.dbHandler = db;
    }

    async subscribeToEvent(clientID, eventName) {
        //call db function for adding event to client
        this.dbHandler.createEvent(clientID, eventName);
    }

    async unsubscribeToEvent(clientID, eventName) {
        //call db function for removing event from client
        await this.dbHandler.deleteEvent(clientID, eventName);
    }


    async runSubbedEvents(clientID, socket) {
        let subbedEvents = await this.dbHandler.getAllClientEvents(clientID);

        const clientData = await this.dbHandler.getAllClientSensorData(clientID);
        if (!subbedEvents) return;
        if (!clientData) return;
        if (clientData.length === 0) {
            return
        }
        subbedEvents.forEach(event => {
            const foundEvent = this.eventMap[event.EventName];

            if (foundEvent) {
                foundEvent(socket, clientData);
            } else {
                console.log(`Event ${event} not found in eventMap`);
            }
        });
    }
}

module.exports = EventHandler;


// BRUGES IKKE
// async function sensorType(clientID) {
//   return await this.dbHandler.getSensorType(clientID); // Return the awaited value
// }

// async function createEvents(clientID) {
//   let sensorObj = await sensorType(clientID);
//   console.log(sensorObj);
//   const eventMap = {
//     TemperatureExceedsMax: async (clientID) => {
//       try {
//         // Get all data from clients sensor
//         await this.dbHandler.getAllClientSensorData(clientID).then((rows) => {
//           console.log(rows);
//           // Do something with data from clients sensor
//         });
//       } catch (err) {
//         console.error(err.message);
//       }
//     },
//   };

//   Object.keys(eventMap).forEach((key) =>
//     this.dbHandler.createEvent(clientID, sensorObj.SensorType, key)
//   );
// }

// createEvents("c7d90151-891d-436d-8a22-3f4a891c5348");

//console.log(eventMap);
//console.log(eventMap.TemperatureExceedsMax("8aed2fe1-06e3-4d69-89e9-44efce4dedf2"));

