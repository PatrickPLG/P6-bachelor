
// Class to capture process exits and call app specific cleanup function
class Cleanup {
    constructor(callback = () => {}) {
        this.cleanupCallback = callback;

        process.on('cleanup', this.cleanupCallback);

        process.on('exit', this.handleExit);

        process.on('SIGINT', this.handleSigInt);

        process.on('uncaughtException', this.handleUncaughtException);
    }

    handleExit = () => {
        process.emit('cleanup');
    }

    handleSigInt = () => {
        console.log('\nCtrl-C...');
        process.exit(2);
    }

    handleUncaughtException = (e) => {
        console.log('\nUncaught Exception...');
        console.log(e.stack);
        process.exit(99);
    }
}

module.exports = { Cleanup }





/*
function noOp() {}

exports.Cleanup = function Cleanup(callback) {

    // attach user callback to the process event emitter
    // if no callback, it will still exit gracefully on Ctrl-C
    callback = callback || noOp;
    process.on('cleanup',callback);

    // do app specific cleaning before exiting
    process.on('exit', function () {
        process.emit('cleanup');
    });

    // catch ctrl+c event and exit normally
    process.on('SIGINT', function () {
        console.log('\nCtrl-C...');
        process.exit(2);
    });

    //catch uncaught exceptions, trace, then exit normally
    process.on('uncaughtException', function(e) {
        console.log('\nUncaught Exception...');
        console.log(e.stack);
        process.exit(99);
    });
};*/
