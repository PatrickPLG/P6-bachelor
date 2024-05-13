const db = require('./database')
const clientHandler = require('./clientHandler.js');
const startApiServer = require('./api.js');
const EventHandler = require('./eventHandler.js');
dbHandler = new db();
eventHandler = new EventHandler(dbHandler);
const _clientHandler = new clientHandler.ClientHandler(dbHandler, eventHandler);
startApiServer(3001, dbHandler, _clientHandler, _clientHandler.io);
