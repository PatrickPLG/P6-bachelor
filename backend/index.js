const {Server} = require("socket.io");
const express = require('express');
const cors = require('cors');
const db = require('./database')
const {json} = require("express");
const clientHandler = require('./clientHandler.js');
const {instructionFactory} = require("./lib/intructionFactory");
const startApiServer = require('./api.js');
const EventHandler = require('./eventHandler.js');
dbHandler = new db();
const _clientHandler = new clientHandler.ClientHandler()
startApiServer(3001, dbHandler)

eventHandler = new EventHandler(dbHandler);

// Opsæt socket.io server og tillad CORS
const io = new Server({
    cors: {
        origin: "*",  // Tillad alle anmodninger (bør nok ændres til specifikke cases, men fint til test)
        methods: ["GET", "POST"],  // Tilladte HTTP-metoder
    }
});

io.listen(3000);

io.on("connection", (socket) => {
    const credentials =

        socket.on('register', async (credentials, callback) => {
            console.log('Client trying to register with credentials:', credentials)

            try {
                let jsonCredentials;

                if (typeof credentials === 'string') {
                    _clientHandler.addClient(socket, jsonCredentials.CLIENT_ID);
                    jsonCredentials = JSON.parse(credentials);
                } else if (typeof credentials === 'object') {
                    jsonCredentials = credentials;
                    _clientHandler.addClient(socket, jsonCredentials.CLIENT_ID);
                } else {
                    throw new Error('Invalid credentials');
                }

                const clientId = jsonCredentials.CLIENT_ID;


                if (!clientId) {
                    console.error('No CLIENT_ID provided');
                    callback(new Error('No CLIENT_ID provided'));
                    return;
                }

                await dbHandler.registerClient(clientId);
                callback(null, 'Client registered successfully');
            } catch (error) {
                console.error('Error while registering client:', error);
                callback(error);
            }

        });

    socket.on('disconnect', () => {
        _clientHandler.removeClient(socket.id);
    })
    //socket.on('register', async (credentials, callback) => dbHandler.registerClient(JSON.parse(credentials)))

    socket.on('message', (msg, callback) => {
        const jsonMsg = JSON.parse(msg);
        const clientId = jsonMsg.CLIENT_ID;
        const sensorType = jsonMsg.sensor_type;
        const timestamp = jsonMsg.timestamp;
        const sensorData = JSON.stringify(jsonMsg.sensor_data);


        dbHandler.getClientById(clientId).then(async (row) => {
            if (row) {
                await dbHandler.updateSensorData(sensorType, timestamp, sensorData, clientId)
                await eventHandler.runSubbedEvents(clientId,socket);
                /*console.log('User found:', row);*/

                /*
                                const instruction = new instructionFactory();

                                instruction.addText(
                                    `${jsonMsg.sensor_data['facesDetected'] > 0 ? '#00FF00' : '#FF0000'}`,
                                    250,
                                    50,
                                    1000,
                                    50,
                                    50,
                                    `${jsonMsg.sensor_data['facesDetected'] > 0 ? 'Face detected' : 'No face detected'}`
                                )

                                for (let i = 0; i < jsonMsg.sensor_data['facesDetected']; i++) {
                                    const ran = Math.max(50, Math.floor(Math.random() * 75))

                                    instruction.addCircle(
                                        '#FF0000',
                                        150 * (i + 1),
                                        200,
                                        ran
                                    )

                                    instruction.addText(
                                        '#FFFFFF',
                                        170 * (i + 1) - 25,
                                        200 + ran / 2 + 10,
                                        1000,
                                        50,
                                        20,
                                        `${i + 1}`
                                    )
                                }

                                instruction.addText(
                                    '#FFFFFF',
                                    400,
                                    300,
                                    1000,
                                    50,
                                    50,
                                    `${jsonMsg.sensor_data['facesDetected']}`
                                )


                                const testJson = instruction.getInstructions();

                                console.log(testJson)
                                await dbHandler.updateSensorData(sensorType, timestamp, sensorData, clientId)

                                socket.emit('draw', testJson)
                                io.emit('update')*/

            } else {
                await dbHandler.createClient(clientId)
            }
        }).catch((err) => {
            console.error(err.message);
        })
        callback();
    });
});

io.on("disconnect", (socket) => {

});
