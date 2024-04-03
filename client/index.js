require('./src/cleanup').Cleanup(myCleanup);

function myCleanup() {
    console.log('Cleaning up before exit..');
    pipeHandler.removeAllPipes().then((res) => console.log('All pipes removed:', res));
}


// Prevents the program from closing instantly
process.stdin.resume();

console.log(`PID:${process.pid} App is running.\nPress CTRL+C to exit. `);
console.log("_________________________________________________________________________________________");


const {PipeHandler} = require('./src/pipeHandler');
const pipeHandler = new PipeHandler();
pipeHandler.createPipe().then( () => {
    const readStream = pipeHandler.getFileStream()

    console.log('Pipe created. Reading from pipe..');
    readStream.on('data', (data) => {
        console.log('Received:', data.toString());
    })
})










