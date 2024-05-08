const {instructionFactory} = require("./intructionFactory");


function findSensorDataFromType(data, type) {
    console.log('data', data)
    const sensor = data.find(sensor => sensor['SensorType'] === type)
    return JSON.parse(sensor['SensorData'])
}

const eventMap = {
    'FacesDetected': (socket, data) => {
        console.log('executing TemperatureExceedsMax');


        const sensor = findSensorDataFromType(data, 'facesDetected')


        if (sensor['facesDetected'] > 1) {
            const instruction = new instructionFactory();
            instruction.addText('#FF0000', 250, 50, 1000, 50, 50, 'faces detected')
            instruction.addText('#FF0000', 250, 50, 1000, 50, 50, `${sensor['facesDetected']} faces detected`)

            const eventInstruction = instruction.getInstructions();

            socket.emit('draw', eventInstruction)

            console.log('data', data)
        }


        return 0
    },
    'NoFacesDetected': (socket, data) => {


        const sensor = findSensorDataFromType(data, 'facesDetected')

        if (sensor['facesDetected'] === 0) {
            const instruction = new instructionFactory();
            instruction.addText('#FF0000', 250, 50, 1000, 50, 50, 'no faces detected')

            const eventInstruction = instruction.getInstructions();

            socket.emit('draw', eventInstruction)

            console.log('data', data)
        }


        return 0
    },
    'showIdle': (socket, data) => {

        const sensor = findSensorDataFromType(data, 'facesDetected')
        if (sensor['facesDetected'] === 0) {
            const instruction = new instructionFactory();
            instruction.addRectangle('#ffffff', 500, 500, 500, 100, 10)
            instruction.addText('#000000', 500, 480, 50, 'Welcome to McMyFace')
            instruction.addText('#424242', 500, 521, 21, 'Please show your face to order')
            const eventInstruction = instruction.getInstructions();

            socket.emit('draw', eventInstruction)

            console.log('data', data)
        }

        return 0
    }
}


module.exports = eventMap;