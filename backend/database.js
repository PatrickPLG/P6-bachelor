const sqlite3 = require('sqlite3').verbose();


class dbHandler {
    constructor() {
        this.db = new sqlite3.Database('./p6.db', (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Connected to the database.');
                this.db.serialize(() => {
                    this.db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, CLIENT_ID TEXT NOT NULL)`);
                });
            }
        });
    }

    async createClient(clientId) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO users (CLIENT_ID) VALUES (?)`, [clientId], function (err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log(`A client has been created with CLIENT_ID ${clientId} on row ${this.lastID}`);
                    resolve(this.lastID);
                }
            });
        });
    }


    async getClientById(clientId) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM users WHERE CLIENT_ID = ?`, [clientId], (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async getAllClients() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM users`, (err, rows) => {
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
            this.db.run(`DELETE FROM users WHERE CLIENT_ID = ?`, [clientId], function (err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log(`Client with CLIENT_ID ${clientId} has been deleted.`);
                    resolve();
                }
            });
        });
    }

    async deleteAllClients() {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM users`, function (err) {
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
        console.log("Enterred registerClient. Here is the data: " + clientId);
        // Check if client already exists
        let client = await this.getClientById(clientId);
        if (client) {
           /* console.log(`Client with CLIENT_ID ${clientId} already exists.`);*/
            return client;
        }
        // Create client
        return await this.createClient(clientId);
    }


}



module.exports = dbHandler;
