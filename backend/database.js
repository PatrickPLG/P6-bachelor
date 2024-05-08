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
                                EventName TEXT,
                                FOREIGN KEY (CLIENT_ID) REFERENCES Client(CLIENT_ID),
                                UNIQUE (CLIENT_ID, EventName)
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

    async createEvent(clientID, EventName) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO Event(CLIENT_ID, EventName) VALUES (?,?)`, [clientID, EventName],(err, rows) => {
                if (err) {
                    console.log(err.message);
                    reject(err);
                } else {
                    resolve(rows)
                }
            })
        })
    }


    async getAllSensorData() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM SensorData`, (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getSensorType(clientId) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT SensorType FROM Sensor WHERE CLIENT_ID = ?`, [clientId] , (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getAllClientSensorData(clientID) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT Sensor.SensorType, SensorData FROM Sensor INNER JOIN SensorData ON Sensor.SensorType = SensorData.SensorType WHERE CLIENT_ID = ?`, [clientID], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async deleteEvent(clientID, EventName) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Event WHERE CLIENT_ID = ? AND EventName = ?`, [clientID, EventName], (err) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log(`Event with CLIENT_ID ${clientID} and EventName ${EventName} has been deleted.`);
                    resolve();
                }
            });
        });
    }

    async deleteAllClientEvents(clientId) {
        return new Promise((resolve,reject) => {
            this.db.run(`DELETE FROM Event WHERE CLIENT_ID = ?`, [clientId], (err) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log(`All events for CLIENT_ID ${clientId} have been deleted.`);
                    resolve();
                }
            });
        })
    }

    async getAllClientEvents(clientID) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT EventName FROM Event WHERE CLIENT_ID = ?`, [clientID], (err, rows) => {
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
             console.log(`Client ${clientId} already registered.`);
            return client;
        }
        // Create client
        console.log(`Registered CLIENT_ID:  ${clientId}.`);
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
                        console.log(`Sensor ${sensorType} not found for client ${clientId}.`)
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
