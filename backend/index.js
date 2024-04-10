const {Server} = require("socket.io");

const io = new Server(3000, { /* options */});

io.on("connection", (socket) => {
    console.log('Client connected');
    socket.on('message', (msg, callback) => {
        console.log(`Data from ${socket.id}:`, msg);
        /*  received data from client model
        {
            "APPLICATION_ID": String,
            "timestamp": DateTime,
            "sensor_type": String,
            "sensor_data": Object,
        }
        */

        //EVENT SYSTEM HERE

        //Find the User in the database using the APPLICATION_ID

        //Get the user's subscribed events



        callback();
    })
});

io.on("disconnect", (socket) => {
    console.log('Client disconnected: ', socket.id);
})


//create express endpoint for client to request credentials

const express = require('express');
const app = express();
const port = 3001;

app.get('/credentials', (req, res) => {

    //generate credentials function (UUID)
    //...

    //register to database function
    //...


    //return credentials to client
    res.send('saklgfmsagioa8214918hidsahdiusahiudhiasuh')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


