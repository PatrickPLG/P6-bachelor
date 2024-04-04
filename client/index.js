require('./src/cleanup').Cleanup(myCleanup);
// Prevents the program from closing instantly
process.stdin.resume();


function myCleanup() {
    console.log('Cleaning up before exit..');
    pipeHandler.removeAllPipes().then((res) => console.log('All pipes removed:', res));
}


const {PipeHandler} = require('./src/pipeHandler');
const pipeHandler = new PipeHandler();

function startServer() {
    const socket = require('socket.io-client')('http://localhost:3000', {});

    socket.on('connect', function () {
        console.log('Connected to server');
    })

    console.log(`PID:${process.pid} App is running.\nPress CTRL+C to exit. `);
    console.log("_________________________________________________________________________________________");

    pipeHandler.createPipe().then(() => readPipe(pipeHandler, socket))
}

function readPipe(pipeHandler, socket) {
    pipeHandler.getFileStream().on('data', (data) => {
        console.log('Received data from pipe:', data.toString());
        socket.emit("message", data.toString(), () => {
            console.log('Data sent to server');
        });
    })
}

startServer()

/*pipeHandler.createPipe().then(() => {
    const readStream = pipeHandler.getFileStream()





        console.log('Waiting for data from sensor..');


        readStream.on('data', (data) => {
            console.log('Received data from pipe:', data.toString());


            socket.emit("message",  data.toString(), () => {
                console.log('Data sent to server');
            });


        })


})*/










