const {FrameJustWorks} = require("./lib/server");


const clientServer = new FrameJustWorks()

clientServer.start()

clientServer.registerSensor('SensorOne', 'facesDetected')

