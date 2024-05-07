const db = require("./database");

dbHandler = new db();


class eventHandler {
  constructor() {
    this.eventMap = {
      'TemperatureExceedsMax': () => {
        console.log('executing TemperatureExceedsMax');
        return 0
      },
      'TemperatureExceedsMax231321': () => {
        console.log('executing TemperatureExceedsMax');
        return 0
      }
    }
  }

  async subscribeToEvent(clientID, eventName) {
    //call db function for adding event to client
    let sensorObj = await sensorType(clientID);
    dbHandler.createEvent(clientID, sensorObj.SensorType, eventName);
  }

  unsubscribeToEvent(clientID, eventName) {
    //call db function for removing event from client
    dbHandler.deleteEvent(clientID, eventName);
  }

  async runSubbedEvents(clientID) {
    let subbedEvents = await this.getSubbedEvents(clientID);
    
    subbedEvents.forEach(event => {
      var foundEvent = this.eventMap[event.EventName];
      if (foundEvent) {
        foundEvent();
      } else {
        console.log(`Event ${event} not found in eventMap`);
      }
    });
  }

  async getSubbedEvents(clientID) {
    //const subbedEvents = Get subscribed events from client
    //return subbedEvents
    let subbedEvents = await dbHandler.getAllClientEvents(clientID);
    
    return subbedEvents;
  }

  // Function to get sensortype
  async sensorType(clientID) {
    return await dbHandler.getSensorType(clientID); // Return the awaited value
  }
}

Event = new eventHandler();
Event.runSubbedEvents("c7d90151-891d-436d-8a22-3f4a891c5348");

// async function sensorType(clientID) {
//   return await dbHandler.getSensorType(clientID); // Return the awaited value
// }

// async function createEvents(clientID) {
//   let sensorObj = await sensorType(clientID);
//   console.log(sensorObj);
//   const eventMap = {
//     TemperatureExceedsMax: async (clientID) => {
//       try {
//         // Get all data from clients sensor
//         await dbHandler.getAllClientSensorData(clientID).then((rows) => {
//           console.log(rows);
//           // Do something with data from clients sensor
//         });
//       } catch (err) {
//         console.error(err.message);
//       }
//     },
//   };

//   Object.keys(eventMap).forEach((key) =>
//     dbHandler.createEvent(clientID, sensorObj.SensorType, key)
//   );
// }

// createEvents("c7d90151-891d-436d-8a22-3f4a891c5348");

//console.log(eventMap);
//console.log(eventMap.TemperatureExceedsMax("8aed2fe1-06e3-4d69-89e9-44efce4dedf2"));

