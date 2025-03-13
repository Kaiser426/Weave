// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Set up Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }
});

// Middleware to parse JSON requests for Express routes
app.use(express.json());

// Serve static files (index.html, stylesheet.css) from the current directory
app.use(express.static(__dirname));

// Player data: Array to store players and their roles
let players = [
    { id: 1, name: "Sir Kael", role: "Vanguard" },
    { id: 2, name: "Zyx", role: "Striker" },
];

// Available roles to assign (optional, can be expanded)
const availableRoles = ["Vanguard", "Striker", "Warden", "Arcanist", "Face"];

// GET endpoint: Retrieve all players
app.get('/players', (req, res) => {
    res.json(players);
});

// POST endpoint: Add a new player with a role (manual addition still available)
app.post('/players', (req, res) => {
    const { name, role } = req.body;
    if (!name || !role) {
        return res.status(400).json({ error: "Name and role are required" });
    }
    const newPlayer = {
        id: players.length + 1,
        name,
        role,
    };
    players.push(newPlayer);
    res.status(201).json(newPlayer);
});

// Socket.IO connection and events
io.on('connection', (socket) => {
    console.log('a user connected');

    // Prompt the new player to choose their name
    socket.emit('promptName', { message: "Please choose your character name" });

    // Handle the player's submitted name
    socket.on('submitName', (name) => {
        if (!name || typeof name !== 'string' || name.trim() === '') {
            socket.emit('promptName', { message: "Invalid name, please try again" });
            return;
        }

        // Assign a default role (e.g., rotate through availableRoles)
        const role = availableRoles[players.length % availableRoles.length];
        const newPlayer = {
            id: players.length + 1,
            name: name.trim(),
            role,
            socketId: socket.id // Track the player’s socket for direct communication
        };

        players.push(newPlayer);
        console.log(`Player ${name} joined as ${role}`);

        // Notify all clients of the updated player list
        io.emit('playerUpdate', players);

        // Welcome the new player
        socket.emit('welcome', { message: `Welcome, ${name}! You are a ${role}.` });
    });

    // Original Socket.IO events
    socket.on('dragMoveToken', (data) => {
        socket.broadcast.emit('dragMoveToken', data);
    });
    socket.on('startUpdatingDrawing', (data) => {
        socket.broadcast.emit('startUpdatingDrawing', data);
    });
    socket.on('updateDrawing', (data) => {
        socket.broadcast.emit('updateDrawing', data);
    });
    socket.on('clearAllDrawings', () => {
        socket.broadcast.emit('clearAllDrawings');
    });
    socket.on('updateMap', (imageURL) => {
        socket.broadcast.emit('updateMap', imageURL);
    });

    // Chat message event
    socket.on('chatMessage', (msg) => {
        console.log('Server received:', msg);
        io.emit('chatMessage', msg);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('a user disconnected');
        players = players.filter(player => player.socketId !== socket.id);
        io.emit('playerUpdate', players); // Update all clients
    });
});

// Start the server on port 8080
server.listen(8080, () => {
    console.log('listening on http://localhost:8080');
});
