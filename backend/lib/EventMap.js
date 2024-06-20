const {instructionFactory} = require("./intructionFactory");
const fs = require("node:fs");
const utils = require("./utils");
const db = require('../database.js')
const dbHandler = new db();
function createBeerGlass(instructions, x, y) {
    // Add a rectangle for the beer glass
    instructions.addRectangle('#D3D3D3', x + 37.5, y + 12.5, 25, 50, 2.5); // light gray rectangle with rounded corners

    // Add a rectangle for the beer itself
    instructions.addRectangle('#F4A460', x + 38.75, y + 13.75, 22.5, 45, 1.25); // sandy brown rectangle for the beer inside the glass

    // Add circles for the foam
    instructions.addCircle('#EDEDED', x + 42.5, y + 11.25, 7.5); // white circle for foam
    instructions.addCircle('#EDEDED', x + 50, y + 10, 8.75); // larger white circle for foam
    instructions.addCircle('#EDEDED', x + 57.5, y + 11.25, 7.5); // white circle for foam

    // Add more circles for smaller foam bubbles on the surface
    instructions.addCircle('#EDEDED', x + 45, y + 15, 5); // small white circle
    instructions.addCircle('#EDEDED', x + 50, y + 15, 7.5); // larger white circle for foam
    instructions.addCircle('#EDEDED', x + 55, y + 15, 5); // small white circle

    // Add additional smaller foam bubbles around the main foam
    instructions.addCircle('#EDEDED', x + 43, y + 18, 3); // smaller white circle
    instructions.addCircle('#EDEDED', x + 47, y + 18, 4); // smaller white circle
    instructions.addCircle('#EDEDED', x + 53, y + 18, 4); // smaller white circle
    instructions.addCircle('#EDEDED', x + 57, y + 18, 3); // smaller white circle

    // Add a base to the beer glass
    instructions.addRectangle('#A9A9A9', x + 35, y + 62.5, 30, 5, 2.5); // dark gray rectangle for the glass base

    // Add reflection on the glass
    instructions.addRectangle('#F5F5F5', x + 40, y + 15, 3, 40, 1); // light gray rectangle for reflection
    instructions.addRectangle('#F5F5F5', x + 50, y + 20, 2, 30, 1); // smaller light gray rectangle for reflection

    // Add small beer bubbles inside the beer
    instructions.addCircle('#FFD700', x + 42, y + 30, 2); // small yellow circle for beer bubble
    instructions.addCircle('#FFD700', x + 45, y + 40, 1.5); // small yellow circle for beer bubble
    instructions.addCircle('#FFD700', x + 48, y + 50, 2); // small yellow circle for beer bubble
    instructions.addCircle('#FFD700', x + 52, y + 35, 1.5); // small yellow circle for beer bubble
    instructions.addCircle('#FFD700', x + 55, y + 45, 2); // small yellow circle for beer bubble
    instructions.addCircle('#FFD700', x + 58, y + 38, 1.5); // small yellow circle for beer bubble
    instructions.addCircle('#FFD700', x + 50, y + 55, 2); // small yellow circle for beer bubble
}

function findSensorDataFromType(data, type) {
    if (!data || data === []) return null
    const sensor = data.find(sensor => sensor['SensorType'] === type)
    if (!sensor) return null
    return JSON.parse(sensor['SensorData'])
}

async function runPythonScript(username) {
    const spawn = require("child_process").spawn;
    //./stsCli/sts.py
    const process = spawn('python3', ['lib/stsCli/sts.py', `-u ` + username, '-r',]);


    return new Promise((resolve, reject) => {
        process.stdout.on('data', (data) => {
            // console.log('Data:',parseRanking(data.toString()))
            resolve(parseRanking(data.toString()))
            /*if (data.toString().includes('Date')) {
                const parsed = parsePurchaseHistory(data.toString())
                resolve(parsed)
            }*/
        })
    })


}

function parseRanking(dataString) {
    const lines = dataString.split('\n').slice(4); // Skip the header lines
    const result = [];

    lines.forEach(line => {
        if (line.trim()) {
            const parts = line.trim().split(/\s+/);
            const name = parts.slice(0, parts.length - 2).join(' ');
            const gennemsnit = parts[parts.length - 2];
            const rank = parts[parts.length - 1];
            result.push({name, gennemsnit, rank});
        }
    });

    return result;
}


function parsePurchaseHistory(dataString) {
    const lines = dataString.split('\n').slice(3); // Skip the header lines
    const result = [];

    lines.forEach(line => {
        if (line.trim()) {
            const date = line.substring(0, 24).trim();
            const price = line.substring(line.length - 8).trim();
            const item = line.substring(25, line.length - 9).trim();
            result.push({date, item, price});
        }
    });

    return result;
}


const eventMap = {
    'thisIsAnEvent': async (socket, data) => {
        const parsedData = findSensorDataFromType(data, 'facesDetected')
        let userRank
        if (parsedData.specialMember) {
            userRank = [{name: 'Øl', gennemsnit: '0', rank: '0'}]
        } else {
            userRank = await runPythonScript(parsedData.username)
        }

        //find object with {name: 'Øl', ...}
        const beerRank = userRank.find(rank => rank.name === 'Øl')
        console.log('Beer rank:', beerRank)


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


        if(!parsedData.specialMember){

            //TITLE
            instructions.addText('#393939', 324, 10, 80, 'FOOBAR - CASSIOPEIA', 872, 84)
            instructions.addRectangle('#393939', 324, 100, 872, 2, 10)
            createBeerGlass(instructions, 300, 15)
            createBeerGlass(instructions, 1110, 15)


            instructions.addText('#393939', 1422, 1030, 60, `${amountOfMembersSeen}`, 468, 74)
            instructions.addText('#393939', 1422, 1080, 30, 'Members seen today', 468, 74)

            instructions.addText('#393939', 324, 220, 60, 'Member detected', 872, 84)
            instructions.addText('#393939', 324, 750, 44, personDetectedString, 872, 50)
            instructions.addText('#888888', 324, 900, 44, `${timeSinceLastSeen}`, 872, 50)
            instructions.addText('#393939', 324, 800, 44, `Beer rank: ${beerRank.rank} `, 872, 50)

            instructions.addText('#393939', 324, 850, 44, `Average: ${beerRank.gennemsnit} beers consumed a day`, 872, 50)
            const img = utils.base64_encode(`/Users/danielsejersen/Projects/P6-bachelor/client/io/sensors/stsRazzia/faces/${parsedData.imageName}`)
            instructions.addImage(img, 589, 350, 350, 350)

            instructions.addRectangle('#dfe6e9', 1422, 0, 468, 1000, 10)


            for (let i = 0; i < attendees.length; i++) {
                if (i >= 20) break
                const attendee = attendees[i]
                instructions.addText('#393939', 1445, 50 + (50 * i), 40, attendee.name, 150, 50)
                instructions.addText('#888888', 1760, 50 + (50 * i), 40, attendee.lastSeen, 100, 50)
                instructions.addRectangle('#888888', 1442, 100 + (50 * i), 428, 2, 10)
            }



        } else {

            instructions.addText('#000000', 1422, 1030, 60, `${amountOfMembersSeen}`, 468, 74)
            instructions.addText('#000000', 1422, 1080, 30, 'Members seen today', 468, 74)

            instructions.addRectangle('#74b9ff', 324, 196, 872, 688, 20)
            instructions.addText('#ffffff', 324, 220, 70, 'Special member detected', 872, 84)
            instructions.addText('#ffffff', 324, 750, 44, parsedData.name, 872, 50)
            instructions.addText('#ffffff', 324, 800, 44, `${timeSinceLastSeen}`, 872, 50)
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


        }

        socket.emit('draw', instructions.getInstructions())
        return 0

    },
}


module.exports = eventMap;