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
            socket.on('register', async (data, callback) => {
                try {
                    // Extract client ID from message
                    const clientId = this.extractClientIdFromMessage(data);

                    // if client ID is not found, return an error
                    if (!clientId) {
                        callback(new Error('Invalid credentials'));
                        return;
                    }

                    // Add clientId to list of active clients (with socket)
                    this.addClient(socket, clientId);

                    // Register client in database (if not already registered)
                    await dbHandler.registerClient(clientId).then(() => {
                        callback(null, 'Client registered successfully');
                    }).catch((error) => {
                        console.error('Error while registering client:', error);
                        callback(error);
                    });


                } catch (error) {
                    console.error('Error while registering client:', error);
                    callback(error);
                }

            });

            socket.on('disconnect', () => {
                this.removeClient(socket.id); // Remove client from list of active clients
            })

            socket.on('data', async (msg, callback) => {
                // Extract data from message
                const {clientId, sensorType, timestamp, sensorData} = this.extractDataFromMessage(msg);
                const validated = this.validateClient(clientId);
                if (validated) {
                    await this.dbHandler.updateSensorData(sensorType, timestamp, sensorData, clientId) // Store data in database
                    await this.eventHandler.runSubbedEvents(clientId, socket); // Run subscribed events
                    callback(null, 'Data received and stored successfully');
                } else {
                    console.error('Client not registered');
                    callback(new Error('Client not registered'));
                }
            });
        });

    }

    extractClientIdFromMessage(msg) {
        let clientId = null;
        if (!msg) return clientId;
        if (typeof msg !== 'string') clientId = msg.CLIENT_ID
        else clientId = JSON.parse(msg).CLIENT_ID ?? null;
        return clientId;
    }

    extractDataFromMessage(msg) {
        const clientId = msg.CLIENT_ID; // Extract client ID

        const sensorType = msg.sensor_type; // Extract sensor type

        const timestamp = msg.timestamp; // Extract timestamp

        // Extract sensor data (and stringify so we can store it in the database)
        const sensorData = JSON.stringify(msg.sensor_data)
        return {clientId, sensorType, timestamp, sensorData};
    }

    addClient(socket, clientID) {
        this.clients.push({socket, clientID});
    }

    removeClient(socketID) {
        this.clients = this.clients.filter(client => client.socket.id !== socketID);
    }

    async validateClient(clientID) {
        if (!this.getSocketIdByClientId(clientID)) {
            console.error('Client not registered');
            return false;
        }
        return true;
    }

    getSocketIdByClientId(clientID) {
        const client = this.clients.find(client => client.clientID === clientID);
        return client ? client.socket.id : null;
    }

}

module.exports = ClientHandler

