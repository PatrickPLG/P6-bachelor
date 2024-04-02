const { spawn, fork } = require('child_process');
const fs              = require('fs');

const pipe = 'pipeId'
let io = spawn('mkfifo', [pipe])

io.on('exit', function() {
    console.log('Created Pipe');
    const fd   = fs.openSync(pipe, 'r+');
    let ioRead = fs.createReadStream(null, { fd });

    ioRead.on('data', data => {
        console.log("til patrick"+ data.toString());
    })

})






