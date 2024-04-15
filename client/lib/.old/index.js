const {PipeHandler} = require("../pipeHandler");
require('../cleanup').Cleanup(() => {
    console.log('Cleaning up before exit..');
    pipeHandler.removeAllPipes().then((res) => console.log('All pipes removed:', res));
});

/*// Prevents the program from closing instantly
process.stdin.resume();*/



function main() {
    require('../configuration').validateConfiguration().then(async (error) => {
        if (error) { //TODO: errors should probably be handled by the configuration module
            console.log('Error:', error);
            if (error === 'No_application_ID_found') {
                await require('../configuration').getCredentialsFromServer();
            }

            if (error === 'No_internet_connection_available') {
                // implement logic to bootstrap the application to get internet connection
                process.exit(1);
            }

        }
        startServer();
    })
}

main()

const pipeHandler = new PipeHandler();

function startServer() {
    const socket = require('socket.io-client')('http://localhost:3000', {});

    socket.on('connect', function () {
        console.log('Connected to server');
    })

    console.log(`PID:${process.pid} App is running.\nPress CTRL+C to exit. `);
    console.log("_________________________________________________________________________________________");

    pipeHandler.createPipe('SensorOne').then(() => readPipe(pipeHandler, socket))
}

function readPipe(pipeHandler, socket) {
    pipeHandler.getFileStream('SensorOne').on('data', (data) => {
        console.log('Received data from pipe: \n', JSON.parse(data.toString()))
        socket.emit("message", data.toString(), () => {
            console.log('Data sent to server');
        });
    })
}











