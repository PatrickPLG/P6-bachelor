const {FrameJustWorks} = require("./lib/server");


const clientServer = new FrameJustWorks()

clientServer.start()

clientServer.registerSensor('SensorOne', 'temperature')
clientServer.registerSensor('SensorTwo', 'light')
clientServer.registerSensor('SensorThree', 'humidity')
