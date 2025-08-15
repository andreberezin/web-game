import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io'
import {startGameServer} from './core/startGameServer.js';
import dotenv from 'dotenv';
const app = express();
const server = http.createServer(app);

dotenv.config();
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;
const VITE_PORT = process.env.EXPRESS_PORT || 5173;
// const HOST = process.env.HOST
// const HOSTNAME = HOST === 'true' ? '0.0.0.0' : 'localhost';

// Socket.io
const io = new Server(server, {
    cors: {
        origin: [`http://localhost:${VITE_PORT}`, 'https://just-panda-musical.ngrok-free.app', 'https://intimate-upright-sunfish.ngrok-free.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true
    },
});

// CORS
app.use(cors({
    origin: [`http://localhost:${VITE_PORT}`, 'https://just-panda-musical.ngrok-free.app', 'https://intimate-upright-sunfish.ngrok-free.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}));

app.use(express.static('public'));

app.use(express.json());

// Start server
server.listen(EXPRESS_PORT, "localhost",() => {
    console.log(`🚀 Express Server running on http://localhost:${EXPRESS_PORT}`);
});

startGameServer(io);
