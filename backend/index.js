const {Server} = require("socket.io");
const express = require('express');
const cors = require('cors');
const db = require('./database');


const app = express();
app.use(cors()); // cors is security feature needed for my html test, since it would establish a connection otherwise. idk if we need it
const port = 3001;


app.get('/credentials', (req, res) => {
	const newClientId = require('uuid').v4()
	res.send(newClientId);
});

app.get('/delete-all-users', (req, res) => {
	db.run(`DELETE FROM users`, function (err) {
		if (err) {
			console.error(err.message);
			res.status(500).send("Failed to delete users");
		} else {
			console.log(`All users deleted, total: ${this.changes}`);
			res.send("All users deleted");
		}
	});
});

app.get('/delete-specific-user', (req, res) => {
	const appId = req.query.appId;
	if (!appId) {
		res.status(400).send("No CLIENT_ID provided");
		return;
	}
	
	db.run(`DELETE FROM users WHERE client_id = ?`, [appId], function (err) {
		if (err) {
			console.error(err.message);
			res.status(500).send("Failed to delete user");
		} else {
			console.log(`User deleted with CLIENT_ID: ${appId}`);
			res.send(`User deleted with CLIENT_ID: ${appId}`);
		}
	});
});

app.get('/get-all-users', (req, res) => {
	db.all(`SELECT * FROM users`, (err, rows) => {
		if (err) {
			console.error(err.message);
			res.status(500).send("Failed to get users");
		} else {
			console.log('All users:', rows);
			res.send(rows);
		}
	});
});

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
	console.log('Client connected');
	
	socket.on('register', (credentials, callback) => {
		console.log('Registering client with credentials:', credentials);
		
		
		db.run(`INSERT INTO users (CLIENT_ID) VALUES (?)`, [credentials], function (err) {
			if (err) {
				return console.error(err.message);
			}
			console.log(`A new user has been added with ID: ${this.lastID}`);
		});
		
	})
	
	
	socket.on('message', (msg, callback) => {
		console.log(`Data from ${socket.id}:`, msg);
		
		
		const jsonMsg = JSON.parse(msg);
		
		
		const clientId = jsonMsg.CLIENT_ID;
		
		db.get(`SELECT * FROM users WHERE client_id = ?`, [clientId], (err, row) => {
			if (err) {
				console.error(err.message);
				return;
			}
			if (row) {
				console.log('User found:', row);
			} else {
				console.log('User not found, adding new user with id: ', clientId);
				db.run(`INSERT INTO users (CLIENT_ID) VALUES (?)`, [clientId], function (err) {
					if (err) {
						return console.error(err.message);
					}
					console.log(`A new user has been added with ID: ${this.lastID}`);
				});
			}
		});
		
		
		callback();
	});
});

io.on("disconnect", (socket) => {
	console.log('Client disconnected: ', socket.id);
});
