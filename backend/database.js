const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./p6.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    else{
        console.log('Connected to the database.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    CLIENT_ID TEXT NOT NULL
    )`);
});

module.exports = db;
