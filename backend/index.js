const {Server} = require("socket.io");
const express = require('express');
const cors = require('cors');
const db = require('./database')
const {json} = require("express");
const clientHandler = require('./clientHandler.js');
const {instructionFactory} = require("./lib/intructionFactory");
const startApiServer = require('./api.js');
const EventHandler = require('./eventHandler.js');
dbHandler = new db();
eventHandler = new EventHandler(dbHandler);
const _clientHandler = new clientHandler.ClientHandler(dbHandler, eventHandler);
startApiServer(3001, dbHandler, _clientHandler, _clientHandler.io);
