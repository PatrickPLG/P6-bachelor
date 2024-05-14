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
