const sqlite3 = require("sqlite3").verbose();

//TODO: change users table to clients

class dbHandler {
    constructor() {
        this.db = new sqlite3.Database("./p6.db", (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log("Connected to the database.");
                this.db.serialize(() => {
                    this.db.run(`CREATE TABLE IF NOT EXISTS Client (
                            ID INTEGER PRIMARY KEY AUTOINCREMENT,
                            CLIENT_ID TEXT NOT NULL
                        )`);

                    this.db.run(`CREATE TABLE IF NOT EXISTS Sensor (
                            ID INTEGER PRIMARY KEY AUTOINCREMENT,
                            CLIENT_ID TEXT NOT NULL,
                            SensorType TEXT NOT NULL,
                            FOREIGN KEY (CLIENT_ID) REFERENCES Client(CLIENT_ID)
                        )`);

                    this.db.run(`CREATE TABLE IF NOT EXISTS SensorData (
                            SensorType TEXT NOT NULL,
                            Timestamp TEXT NOT NULL,
                            SensorData INTEGER,
                            PRIMARY KEY (SensorType, Timestamp)
                        )`);

                    this.db.run(`CREATE TABLE IF NOT EXISTS Event (
                            ID INTEGER PRIMARY KEY AUTOINCREMENT,
                            CLIENT_ID TEXT NOT NULL,
                            SensorType TEXT NOT NULL,
                            EventTypeID INTEGER,
                            FOREIGN KEY (CLIENT_ID) REFERENCES Client(CLIENT_ID),
                            FOREIGN KEY (SensorType) REFERENCES Sensor(SensorType),
                            FOREIGN KEY (EventTypeID) REFERENCES EventType(EventTypeID)
                        )`);

                    this.db.run(`CREATE TABLE IF NOT EXISTS EventType (
                            EventTypeID INTEGER PRIMARY KEY,
                            Name TEXT
                        )`);
                });
            }
        });
    }

    async createClient(clientId) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO Client (CLIENT_ID) VALUES (?)`,
                [clientId],
                function (err) {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        console.log(
                            `A client has been created with CLIENT_ID ${clientId} on row ${this.lastID}`
                        );
                        resolve(this.lastID);
                    }
                }
            );
        });
    }

    async getClientById(clientId) {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT * FROM Client WHERE CLIENT_ID = ?`,
                [clientId],
                (err, row) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        });
    }

    async getAllClients() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Client`, (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async deleteClientById(clientId) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `DELETE FROM Client WHERE CLIENT_ID = ?`,
                [clientId],
                function (err) {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        console.log(`Client with CLIENT_ID ${clientId} has been deleted.`);
                        resolve();
                    }
                }
            );
        });
    }

    async deleteAllClients() {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Client`, function (err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log(`All clients have been deleted.`);
                    resolve();
                }
            });
        });
    }

    //create a new client if it doesn't exist, or return the existing client
    async registerClient(clientId) {
        // Check if client already exists
        let client = await this.getClientById(clientId);
        if (client) {
            /* console.log(`Client with CLIENT_ID ${clientId} already exists.`);*/
            return client;
        }
        // Create client
        return await this.createClient(clientId);
    }

    async updateSensorData(sensorType, timestamp, sensorData, clientId) {
        return new Promise((resolve, reject) => {

            //check if sensor already exists if not register it to the client
            this.db.get(
                `SELECT * FROM Sensor WHERE CLIENT_ID = ? AND SensorType = ?`,
                [clientId, sensorType],
                (err, row) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else if (!row) {
                        this.db.run(
                            `INSERT INTO Sensor (CLIENT_ID, SensorType) VALUES (?, ?)`,
                            [clientId, sensorType],
                            function (err) {
                                if (err) {
                                    console.error(err.message);
                                    reject(err);
                                }
                            }
                        );
                    }
                }
            );


            //remove last sensor data and update with new data
            this.db.run(
                `DELETE FROM SensorData WHERE SensorType = ?`,
                [sensorType],
                function (err) {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    }
                }
            );

            this.db.run(
                `INSERT INTO SensorData (SensorType, Timestamp, SensorData) VALUES (?, ?, ?)`,
                [sensorType, timestamp, sensorData],
                function (err) {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        console.log(
                            `Sensor data for ${sensorType} at ${timestamp} has been updated.`
                        );
                        resolve();
                    }
                }
            );
        })
    }


}

module.exports = dbHandler;
