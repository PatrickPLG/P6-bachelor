const { Server } = require("socket.io");

const io = new Server(3000, { /* options */ });

io.on("connection", (socket) => {
    // ...
    console.log('Client connected');


    socket.on('message', (msg,callback) => {
        console.log(`Data from ${socket.id}:`, msg);
        callback();
    })
});

io.on("disconnect", (socket) => {
    console.log('Client disconnected: ', socket.id);
})

