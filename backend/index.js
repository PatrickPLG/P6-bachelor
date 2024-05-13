const db = require('./database')
const ClientHandler = require('./clientHandler.js');
const Api = require('./api.js');
const EventHandler = require('./eventHandler.js');


dbHandler = new db();
eventHandler = new EventHandler(dbHandler);
clientHandler = new ClientHandler(dbHandler, eventHandler);
api = new Api(3001, dbHandler, clientHandler);

