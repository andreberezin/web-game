const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const port = process.env.BACKEND_PORT || 3000;

// CORS
app.use(cors({
    origin: ['http://localhost:5173', 'https://just-panda-musical.ngrok-free.app'],
    credentials: true,
}));

app.use(express.json());

// Socket.io
const io = new Server(server, {
    cors: { origin: ['http://localhost:5173', 'https://just-panda-musical.ngrok-free.app'] }
});

io.on('connection', (socket) => {
    console.log('🔌 User connected');

    socket.on('disconnect', () => {
        console.log('🔌 User disconnected');
    });
});

// Start server
server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});

module.exports = { io };

require('./game.js');
