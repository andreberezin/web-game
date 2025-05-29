const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const port = process.env.BACKEND_PORT || 3000;

// CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());

// Socket.io
const io = new Server(server, {
    cors: { origin: 'http://localhost:5173' }
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

/*
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
    },
    path: '/socket.io/'
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('🔌 User connected');
    console.log('📍 Socket handshake:', socket.handshake.address);

    socket.on('error', (error) => {
        console.error('❌ Socket error:', error);
    });

    socket.on('disconnect', () => {
        console.log('🔌 User disconnected');
    });
});

// Start server
server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});

// Export for other files to use
module.exports = { app, server, io };

// Import your game logic (if you have it)
require('./game.js');



/!*!// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});*!/



// // Ignore favicon requests
// app.use((req, res, next) => {
//     if (req.originalUrl.includes('favicon.ico')) {
//         return res.status(204).end();
//     }
//     next();
// });*/
