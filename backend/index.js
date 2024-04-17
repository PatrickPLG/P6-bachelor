const {Server} = require("socket.io");
const express = require('express');
const cors = require('cors');
const db = require('./database')
const {json} = require("express");

dbHandler = new db();

const app = express();
app.use(cors()); // cors is security feature needed for my html test, since it would establish a connection otherwise. idk if we need it
app.use(express.json());
const port = 3001;

app.get('/credentials', (req, res) => {
    const newClientId = require('uuid').v4()
    res.send(newClientId);
});

app.post('/register-client', (req, res) => {
    const clientId = req.body.CLIENT_ID;
    console.log('Registering Client ID:', clientId);
    try {
        dbHandler.registerClient(clientId);
        console.log("Successfully registered client");
    } catch (error) {
        console.error('Error while registering client:', error);
        res.status(500).send({message: 'Failed to register client', error: error});
    }
    res.status(200).send({message: 'Client registered successfully', clientId: clientId});
});


app.get('/delete-all-users', (req, res) => {
    dbHandler.deleteAllClients().then(() => {
        console.log(`All users deleted, total: ${this.changes}`);
        res.send("All users deleted");
    }).catch((err) => {
        console.error(err.message);
        res.status(500).send("Failed to delete users");
    })
});

app.get('/delete-specific-user', (req, res) => {
    const appId = req.query.appId;
    if (!appId) {
        res.status(400).send("No CLIENT_ID provided");
        return;
    }
    dbHandler.deleteClientById(appId).then(() => {
        console.log(`User deleted with CLIENT_ID: ${appId}`);
        res.send(`User deleted with CLIENT_ID: ${appId}`);

    }).catch((err) => {
        console.error(err.message);
        res.status(500).send("Failed to delete user");
    })
});

app.get('/get-all-users', (req, res) => {
    dbHandler.getAllClients().then((rows) => {
        console.log('All users:', rows);
        res.send(rows);
    }).catch((err) => {
        console.error(err.message);
        res.status(500).send("Failed to get users");
    })
});

app.get('/get-all-sensor-data', (req, res) => {
    dbHandler.getAllSensorData().then((rows) => {
        console.log('All sensor data:', rows);
        res.send(rows);
    }).catch((err) => {
        console.error(err.message);
        res.status(500).send("Failed to get sensor data");
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log(`Test af db og socket funktionalitet: http://localhost:63342/P6-bachelor/client/userTest.html?_ijt=djst3v89v1f4lbhm3jqab93no1`);
});

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
            try {
                let jsonCredentials;
                if (typeof credentials === 'string') {
                    jsonCredentials = JSON.parse(credentials);
                } else if (typeof credentials === 'object') {
                    jsonCredentials = credentials;
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

    //socket.on('register', async (credentials, callback) => dbHandler.registerClient(JSON.parse(credentials)))

    socket.on('message', (msg, callback) => {
        console.log(`Data from ${socket.id}:`, msg);
        const jsonMsg = JSON.parse(msg);
        const clientId = jsonMsg.CLIENT_ID;
        const sensorType = jsonMsg.sensor_type;
        const timestamp = jsonMsg.timestamp;
        const sensorData = JSON.stringify(jsonMsg.sensor_data);


        dbHandler.getClientById(clientId).then(async (row) => {
            if (row) {
                console.log('User found:', row);

                await dbHandler.updateSensorData(sensorType, timestamp, sensorData, clientId)
                io.emit('update')

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
    console.log('Client disconnected: ', socket.id);
});
