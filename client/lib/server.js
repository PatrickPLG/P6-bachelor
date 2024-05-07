const {Cleanup} = require("./cleanup");
const {PipeHandler} = require("./pipeHandler");
const {Configuration} = require("./configuration");
const utils = require("./utils.js");
require("dotenv").config()

const socketUrl = process.env.SOCKET_URL || 'http://localhost:3000';

//TODO: fix client not starting server when no credentials are found
class FrameJustWorks {
    constructor() {
        this.pipeHandler = new PipeHandler();
        this.configuration = new Configuration();
        this.cleanup = new Cleanup(() => {

            console.log('Cleaning up before exit..');
            try {
                this.pipeHandler.removeAllPipes().then(r => console.log('Pipes removed:', r));
            } catch (e) {
                console.log('Error removing pipes:', e);
            }
        });
    }

    start = () => {
        this.configuration.validateConfiguration().then(async (error) => {
            if (error) { //TODO: errors should probably be handled by the configuration module
                console.log('Error:', error);
                if (error === 'No_application_ID_found') {
                    await this.configuration.getCredentialsFromServer();
                }
                if (error === 'No_internet_connection_available') {
                    // implement logic to bootstrap the application to get internet connection
                    process.exit(1);
                }
            }
            this.startServer();
        })
    }
	
	register = () => {
        const payload = {
            'CLIENT_ID': this.configuration.credentials,
        }
		this.socket.emit("register", payload, () => {
			console.log('Registered with server');
		})
	}

    startServer = () => {
         this.socket = require('socket.io-client')(socketUrl, {});

        this.socket.on('connect',this.register);
        this.socket.on('draw', (data) => {
            utils.writeToJsonFile(data)
        });
        console.log(`PID:${process.pid} App is running.\nPress CTRL+C to exit. `);
        console.log("_________________________________________________________________________________________");

    /*    this.pipeHandler.createPipe('SensorOne').then(({exitCode,pipeId}) => {
            this.pipeHandler.onPipeData(pipeId, (data) => {
                console.log('Received data from pipe: \n', JSON.parse(data.toString()))
                this.socket.emit("message", data.toString(), () => {
                    console.log('Data sent to server');
                });
            })
        })*/
    }

    registerSensor = (sensorId,type) => {
        this.pipeHandler.createPipe(sensorId).then(({exitCode,pipeId}) => {
            this.pipeHandler.onPipeData(pipeId, (data) => {
                console.log('Received data from pipe: \n', JSON.parse(data.toString()))
                this.socket.emit("message", this.packageData(data,type), () => {
                    console.log('Data sent to server');
                });
            })
        })
    }

    packageData = (data,type) => {
        const payload = {
            'CLIENT_ID': this.configuration.credentials,
            timestamp: new Date().getTime(),
            'sensor_type': type,
            'sensor_data': JSON.parse(data),
        }
        return JSON.stringify(payload);
    }
}

module.exports = {
    FrameJustWorks
}