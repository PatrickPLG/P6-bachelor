const express = require("express");
const cors = require("cors");
const eventMap = require("./lib/EventMap");
const app = express();

class Api {

    constructor(port = 3001, dbHandler, clienthandler) {
        this.port = port;
        this.dbHandler = dbHandler;
        this.clienthandler = clienthandler;

        app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });

        app.use(cors()); // cors is security feature needed for my html test, since it would establish a connection otherwise. idk if we need it

        app.use(express.json());

        app.get('/credentials', (req, res) => {
            const newClientId = require('uuid').v4()
            res.send(newClientId);
        });

        app.post('/register-client', async (req, res) => {
            const clientId = req.body.CLIENT_ID;
            console.log('Registering Client ID:', clientId);
            try {
                await this.dbHandler.registerClient(clientId);
                console.log("Successfully registered client");
            } catch (error) {
                console.error('Error while registering client:', error);
                res.status(500).send({message: 'Failed to register client', error: error});
            }
            res.status(200).send({message: 'Client registered successfully', clientId: clientId});
        });

        app.get('/delete-all-users', (req, res) => {
            this.dbHandler.deleteAllClients().then(() => {
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
            this.dbHandler.deleteClientById(appId).then(() => {
                console.log(`User deleted with CLIENT_ID: ${appId}`);
                res.send(`User deleted with CLIENT_ID: ${appId}`);

            }).catch((err) => {
                console.error(err.message);
                res.status(500).send("Failed to delete user");
            })
        });

        app.get('/get-all-users', (req, res) => {
            this.dbHandler.getAllClients().then((rows) => {
                console.log('All users:', rows);
                res.send(rows);
            }).catch((err) => {
                console.error(err.message);
                res.status(500).send("Failed to get users");
            })
        });

        app.get('/get-all-sensor-data', (req, res) => {
            this.dbHandler.getAllSensorData().then((rows) => {
                console.log('All sensor data:', rows);
                res.send(rows);
            }).catch((err) => {
                console.error(err.message);
                res.status(500).send("Failed to get sensor data");
            })
        })

        app.post('/send-instructions', (req, res) => {
            const {clientID, instructions} = req.body;
            console.log('received', clientID, instructions)
            const socketId = this.clienthandler.getSocketIdByClientId(clientID);

            console.log('found socket id:', socketId)
            if (!socketId) {
                return res.status(404).send({message: "Client not found"});
            }

            this.clienthandler.io.to(socketId).emit('draw', instructions);
            res.send({message: "Instructions sent successfully"});
        });

        app.post('/update-client-subscribed-events', async (req, res) => {

            const {clientId, events} = req.body;
            console.log(events)
            console.log(clientId)
            //get sub events from client
            this.dbHandler.getAllClientEvents(clientId).then((rows) => {

                console.log('All events:', rows);
                //delete all events

                this.dbHandler.deleteAllClientEvents(clientId).then(() => {
                    events.forEach(async (event) => {
                        console.log('Adding event:', event);
                        await this.dbHandler.createEvent(clientId, event)
                    })
                })
            })

            res.send({message: "Events updated successfully"});
        })


        app.get('/get-all-available-eventTypes', (req, res) => {
            const eventMap = require('./lib/EventMap')

            console.log(Object.keys(eventMap));

            res.status(200).send(Object.keys(eventMap));

        })
        app.get('/get-client-subscribed-events', (req, res) => {
            const id = req.query.clientId;
            console.log('Getting events for client:', id);
            this.dbHandler.getAllClientEvents(id).then((rows) => {
                console.log('All events:', rows);
                res.send(rows);
            }).catch((err) => {
                console.error(err.message);
                res.status(500).send("Failed to get events");
            })
        })


    }
}

module.exports = Api;
