// server.js

const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: {origin: "*"}
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('dragMoveToken', (data) => {
        socket.broadcast.emit('dragMoveToken', data); // Send to all clients except the sender
    });
    socket.on('startUpdatingDrawing', (data) => {
        socket.broadcast.emit('startUpdatingDrawing', data);
    })
    socket.on('updateDrawing', (data) => {
        socket.broadcast.emit('updateDrawing', data);
    });
    socket.on('clearAllDrawings', () => {
        socket.broadcast.emit('clearAllDrawings');
    })
    socket.on('updateMap', (imageURL) => {
        socket.broadcast.emit('updateMap', imageURL);
    });
    
    const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('chatMessage', (msg) => {
        console.log('Server received:', msg);
        io.emit('chatMessage', msg);
    });
});

server.listen(3000, () => {
    console.log('Server on port 3000');
});

});


http.listen(8080, () => console.log('listening on http://localhost:8080'));
