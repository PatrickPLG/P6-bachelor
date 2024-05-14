const {Server} = require("socket.io");

class ClientHandler {
    dbHandler;
    eventHandler;
    io = new Server({
        cors: {
            origin: "*",  // Allow all requests (should probably be changed to specific cases, but fine for testing)
            methods: ["GET", "POST"],  // Allow HTTP-methods
        }
    });

    constructor(dbHandler, eventHandler) {
        this.clients = [];
        this.dbHandler = dbHandler;
        this.eventHandler = eventHandler;


        this.io.listen(3000);

        this.io.on("connection", (socket) => {
           //Add client to list of active clients
            socket.on('register', async (credentials, callback) => {
                try {
                    let jsonCredentials;

                    if (typeof credentials === 'string') {
                        this.addClient(socket, jsonCredentials.CLIENT_ID);
                        jsonCredentials = JSON.parse(credentials);
                    } else if (typeof credentials === 'object') {
                        jsonCredentials = credentials;
                        this.addClient(socket, jsonCredentials.CLIENT_ID);
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
                this.removeClient(socket.id);
            })
            //socket.on('register', async (credentials, callback) => dbHandler.registerClient(JSON.parse(credentials)))

            socket.on('data', (msg, callback) => {
                const jsonMsg = JSON.parse(msg);
                const clientId = jsonMsg.CLIENT_ID;
                const sensorType = jsonMsg.sensor_type;
                const timestamp = jsonMsg.timestamp;
                const sensorData = JSON.stringify(jsonMsg.sensor_data);


                dbHandler.getClientById(clientId).then(async (client) => {
                    if (!client) await this.dbHandler.createClient(clientId)

                    await this.dbHandler.updateSensorData(sensorType, timestamp, sensorData, clientId)
                    await this.eventHandler.runSubbedEvents(clientId, socket);

                }).catch((err) => {
                    console.error(err.message);
                })
                callback();
            });
        });

    }

    addClient(socket, clientID) {
        this.clients.push({socket, clientID});
    }

    removeClient(socketID) {
        this.clients = this.clients.filter(client => client.socket.id !== socketID);
    }

    getSocketIdByClientId(clientID) {
        const client = this.clients.find(client => client.clientID === clientID);
        return client ? client.socket.id : null;
    }

}

module.exports = ClientHandler

