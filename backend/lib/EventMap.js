const {instructionFactory} = require("./intructionFactory");
const fs = require("node:fs");
const utils = require("./utils");


function findSensorDataFromType(data, type) {
    if (!data || data === []) return null
    const sensor = data.find(sensor => sensor['SensorType'] === type)
    if (!sensor) return null
    return JSON.parse(sensor['SensorData'])
}

const eventMap = {
    'thisIsAnEvent': (socket, data) => {

        //Insert your code here

        //Send instructions to the client like this
        //socket.emit('draw', eventInstructions)
        return 0
    },


}


module.exports = eventMap;