const {instructionFactory} = require("./intructionFactory");
const fs = require("node:fs");
const utils = require("./utils");
const db = require('../database.js')
const dbHandler = new db();

function findSensorDataFromType(data, type) {
    if (!data || data === []) return null
    const sensor = data.find(sensor => sensor['SensorType'] === type)
    if (!sensor) return null
    return JSON.parse(sensor['SensorData'])
}


const eventMap = {
    'thisIsAnEvent': async (socket, data) => {
        const parsedData = findSensorDataFromType(data, 'facesDetected')

        const personDetected = parsedData.name
        console.log('Person detected: ', personDetected)

        let getLastPersonDetected = await dbHandler.getSavedData('lastPersonDetected')

        let totalMembersSeen = await dbHandler.getSavedData('totalMembersSeen')
        if (!totalMembersSeen) {
            totalMembersSeen = {Data: '[]'}
        }

        const membersSeen = JSON.parse(totalMembersSeen['Data'])

        const isPersonRegisteredAsSeen = membersSeen.includes(personDetected)

        if (!isPersonRegisteredAsSeen) {
            membersSeen.push(personDetected)
            await dbHandler.saveNewData('totalMembersSeen', JSON.stringify(membersSeen))
        }
        const amountOfMembersSeen = membersSeen.length

        if (!getLastPersonDetected) {
            getLastPersonDetected = {Data: ''}
        }

        const getAttendees = await dbHandler.getSavedData('attendees')


        const attendees = getAttendees ? JSON.parse(getAttendees['Data']) : []
        //calculate how long since last seen
        const findAttendee = attendees.find(attendee => attendee.name === personDetected)
        const timeSinceLastSeen = findAttendee ? utils.timeSinceFromString(findAttendee['lastSeen']) : 'First time seen'

        if (personDetected !== getLastPersonDetected['Data']) {
            dbHandler.saveNewData('lastPersonDetected', parsedData.name).then(r => {
            })

            let updatedAttendees = attendees
            if (attendees.find(attendee => attendee.name === personDetected)) {
                console.log('Person already in attendees')
                //update last seen and move to top
                updatedAttendees = attendees.filter(attendee => attendee.name !== personDetected)
                updatedAttendees.unshift({
                    name: personDetected,
                    lastSeen: utils.getTimeString()
                })

                /*attendees.forEach(attendee => {
                    if (attendee.name === personDetected) {
                        attendee.lastSeen = utils.getTimeString()
                    }
                })*/
            } else {
                updatedAttendees.unshift({
                    name: personDetected,
                    lastSeen: utils.getTimeString()
                })
            }


            dbHandler.saveNewData('attendees', JSON.stringify(updatedAttendees)).then(r => {
                console.log('Updated attendees:', JSON.stringify(updatedAttendees))
            })
        } else {

        }


        const instructions = new instructionFactory()
        const personDetectedString = `${parsedData.name} (${parsedData.username})`

        //instructions.addRectangle('#dfe6e9', 1422, 1000, 468, 150, 10)
        instructions.addText('#000000', 1422, 1030, 60, `${amountOfMembersSeen}`, 468, 74)
        instructions.addText('#000000', 1422, 1080, 30, 'Members seen today', 468, 74)

        //instructions.addRectangle('#dfffff', 324, 196, 872, 688, 20)
        instructions.addText('#000000', 324, 220, 70, 'Approved member detected', 872, 84)
        instructions.addText('#000000', 324, 750, 44, personDetectedString, 872, 50)
        instructions.addText('#888888', 324, 800, 44, `${timeSinceLastSeen}`, 872, 50)
        const img = utils.base64_encode(`/Users/danielsejersen/Projects/P6-bachelor/client/io/sensors/stsRazzia/faces/${parsedData.imageName}`)
        instructions.addImage(img, 589, 350, 350, 350)

        instructions.addRectangle('#dfe6e9', 1422, 0, 468, 1000, 10)


        for (let i = 0; i < attendees.length; i++) {
            if (i >= 20) break
            const attendee = attendees[i]
            instructions.addText('#000000', 1445, 50 + (50 * i), 40, attendee.name, 150, 50)
            instructions.addText('#888888', 1760, 50 + (50 * i), 40, attendee.lastSeen, 100, 50)
            instructions.addRectangle('#888888', 1442, 100 + (50 * i), 428, 2, 10)
        }
        //instructions.addRectangle('#888888', 1398, 902, 516, 156, 20)
        //instructions.addText('#000000', 1502, 931.5, 70, 'Last seen', 303.5498046875, 74)


        socket.emit('draw', instructions.getInstructions())
        return 0
    },
}


module.exports = eventMap;