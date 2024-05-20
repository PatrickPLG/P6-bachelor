const db = require('./database.js')
dbHandler = new db();

function saveData(ClientID, SensorType, SensorData) {
    dbHandler.saveSensorData(ClientID, SensorType, SensorData)
}

export {saveData}