const {instructionFactory} = require("./intructionFactory");



function findSensorDataFromType(data, type) {
    console.log('data',data)
    return data.find(sensor => sensor['SensorType'] === type)
}

const eventMap = {
    'FacesDetected': (socket,data) => {
        console.log('executing TemperatureExceedsMax');



        const sensor= findSensorDataFromType(data, 'facesDetected')
        const parsedData = JSON.parse(sensor.SensorData)

        if(parsedData.facesDetected > 1) {
            const instruction = new instructionFactory();
            instruction.addText('#FF0000', 250, 50, 1000, 50, 50, 'faces exceeds max')

            const eventInstruction = instruction.getInstructions();

            socket.emit('draw', eventInstruction)

            console.log('data',data)
        }


        return 0
    },
    'PeterErEnBozo': (socket,data) => {
        console.log('executing PeterErEnBozo');

        return 0
    },
    'PatrickErEnBozo': (socket,data) => {
        console.log('executing PatrickErEnBozo');
        return 0
    },
    'GustasErEnBozo': (socket,data) => {
        console.log('executing GustasErEnBozo');
        return 0
    }
}


module.exports = eventMap;