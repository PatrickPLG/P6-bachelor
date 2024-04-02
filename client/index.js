const { spawn, fork } = require('child_process');
const fs              = require('fs');



const pipe = 'pipeId'
let io = spawn('mkfifo', [pipe])


io.on('exit', function() {
    console.log('Created Pipe');
    const fd   = fs.openSync(pipe, 'r+');
    let ioRead = fs.createReadStream(null, { fd });

    ioRead.on('data', data => {
        console.log( data.toString());
    })

})

///home/mosfet/Projects/P6-bachelor/CameraTrackerTest/dist_measure.py

const python = spawn('python', ['../CameraTrackerTest/dist_measure.py']);


// collect data from script
python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...', data.toString());
});





