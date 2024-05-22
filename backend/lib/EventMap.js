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
    'FacesDetected': (socket, data) => {
        console.log('executing TemperatureExceedsMax');
        const sensor = findSensorDataFromType(data, 'facesDetected')

        if (sensor['facesDetected'] > 0) {
            dbHandler.saveNewData("Test", sensor['facesDetected']);
            const instruction = new instructionFactory();
            instruction.addText('#FF0000', 250, 50, 1000, 50, 50, 'faces detected')
            instruction.addText('#FF0000', 250, 50, 1000, 50, 50, `${sensor['facesDetected']} faces detected`)

            const eventInstruction = instruction.getInstructions();

            socket.emit('draw', eventInstruction)

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

        }


        return 0
    },
    'showIdle': (socket, data) => {
        const sensor = findSensorDataFromType(data, 'facesDetected')
        if (sensor)
            if (sensor['facesDetected'] === 0) {
                console.log(`>> executing event (showIdle) at ${utils.getTimeString()}`)
                const instruction = new instructionFactory();
                instruction.addRectangle('#ffffff', 500, 500, 500, 100, 10)
                instruction.addText('#000000', 500, 480, 50, 'Welcome to McMyFace')
                instruction.addText('#424242', 500, 521, 21, 'Please show your face to order')
                const eventInstruction = instruction.getInstructions();

                socket.emit('draw', eventInstruction)

            }

        return 0
    },
    'showMenu': (socket, data) => {
        const sensor = findSensorDataFromType(data, 'facesDetected')
        if (!sensor) return 0
        if (sensor['facesDetected'] > 0) {
            console.log(`>> executing event (showMenu) at ${utils.getTimeString()}`)
            const instruction = new instructionFactory();

            //menu item box
            instruction.addRectangle('#8e6f6f', 0, 280, 300, 200, 10)
            instruction.addText('#000000', -100, 200, 24, 'Burger')
            const burgerImage = fs.readFileSync('./images/b.jpg')
            //encode the file as base64
            const burgerImageBase64 = new Buffer.from(burgerImage).toString('base64')
            instruction.addImage(burgerImageBase64, -100, 250, 200, 100)

            //menu item box
            instruction.addRectangle('#b69b9b', 0, 280 + 220, 300, 200, 10)
            instruction.addText('#000000', -100, 200 + 220, 24, 'Fries')
            instruction.addImage(burgerImageBase64, -100, 250 + 220, 200, 100)


            const eventInstruction = instruction.getInstructions();

            socket.emit('draw', eventInstruction)

        }

        return 0
    }
}


module.exports = eventMap;