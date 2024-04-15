const {Cleanup} = require("./cleanup");
const {PipeHandler} = require("./pipeHandler");
const {Configuration} = require("./configuration");
require("dotenv").config()

const socketUrl = process.env.SOCKET_URL || 'http://localhost:3000';

//TODO: format data to standardized data format
//TODO: smarter way to integrate new pipes
//TODO: make readcredentialsfromfile async
class FrameJustWorks {
    constructor() {
        this.pipeHandler = new PipeHandler();
        this.configuration = new Configuration();
        this.cleanup = new Cleanup(() => {
            console.log('Cleaning up before exit..');
            this.pipeHandler.removeAllPipes().then((res) => console.log('All pipes removed:', res));
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
		this.socket.emit("register", this.configuration.credentials, () => {
			console.log('Registered with server');
		})
	}

    startServer = () => {
         this.socket = require('socket.io-client')(socketUrl, {});

        this.socket.on('connect',this.register);

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
            'sensor-type': type,
            'sensor_data': JSON.parse(data),
        }
        return JSON.stringify(payload);
    }
}

module.exports = {
    FrameJustWorks
}