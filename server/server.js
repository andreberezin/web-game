import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io'

const app = express();
const server = http.createServer(app);

const port = process.env.BACKEND_PORT || 3000;

// Socket.io
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://just-panda-musical.ngrok-free.app', 'https://intimate-upright-sunfish.ngrok-free.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true
    },
});

// CORS
app.use(cors({
    origin: ['http://localhost:5173', 'https://just-panda-musical.ngrok-free.app', 'https://intimate-upright-sunfish.ngrok-free.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}));

app.use(express.static('public'));

app.use(express.json());

// Start server
server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});

import {setupGame} from './game.js';
setupGame(io)

import './game.js';