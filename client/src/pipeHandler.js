const {spawn} = require("child_process");
const fs = require("fs");
require('dotenv').config();

/* const fileDescriptor = fs.openSync(this.pipeid, 'r+');
        readStream = fs.createReadStream(null, {fd: fileDescriptor})*/
class PipeHandler {
    pipes = [];

    constructor() {
        this.pipeid = process.env.PIPE_ID;

    }

    createPipe(pipeId = this.pipeid) {
        return new Promise((resolve, reject) => {
                // Create a named pipe using mkfifo command (mkfifo is a linux only command)
                // https://www.freecodecamp.org/news/node-js-child-processes-everything-you-need-to-know-e69498fe970a/
                const createPipeProcess = spawn('mkfifo', [pipeId]);

                // When the mkfifo command is done executing (pipe is created)
                createPipeProcess.on('exit', (exitCode) => {
                    if (exitCode === 0) {
                        this.pipes.push(pipeId);
                        console.log('Pipe Created:', pipeId);
                        resolve({exitCode: exitCode, pipeId: pipeId})
                    } else {
                        console.log('Error creating pipe: ', pipeId);
                        this.removePipe(pipeId).then(async (res) => {
                            console.log('Pipe Removed:', res);
                            //retry creating pipe
                            await this.createPipe(pipeId).catch((err) => {
                                reject(err);
                            })
                            resolve({exitCode: exitCode, pipeId: pipeId})
                        }).catch((err) => {
                            reject(err);
                        })

                    }
                })
            }
        )
    }

    removePipe(pipeId = this.pipeid) {
        return new Promise((resolve, reject) => {
            fs.unlink(pipeId, (err) => {
                if (err) {
                    console.log('Error removing pipe: ', err);
                    reject(err);
                } else {
                    this.pipes = this.pipes.filter(pipe => pipe !== pipeId);
                    resolve({pipeId: pipeId});
                }
            })
        })
    }

    removeAllPipes() {
        return new Promise((resolve, reject) => {
            this.pipes.forEach(pipe => {
                this.removePipe(pipe).then((res) => {
                    console.log('Pipe Removed:', res);
                }).catch((err) => {
                    reject(err);
                })
            })
            resolve(1);
        })
    }

    getFileStream(pipeId = this.pipeid) {
        const fileDescriptor = fs.openSync(pipeId, 'r+');
        return fs.createReadStream(null, {fd: fileDescriptor});
    }

}


module.exports = {
    PipeHandler
}


