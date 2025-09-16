import express from 'express';
import http from 'http';
import cors from 'cors';
import {Server} from 'socket.io';
import {startGameServer} from './core/startGameServer.js';
import dotenv from 'dotenv';

const app = express();
const server = http.createServer(app);

dotenv.config();
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;
const VITE_PORT = process.env.VITE_PORT || 5173;

const io = new Server(server, {
	cors: {
		origin: [`http://localhost:${VITE_PORT}`, 'https://just-panda-musical.ngrok-free.app', 'https://intimate-upright-sunfish.ngrok-free.app', process.env.VITE_FRONTEND_URL],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		credentials: true
	}
});

app.use(cors({
	origin: [`http://localhost:${VITE_PORT}`, 'https://just-panda-musical.ngrok-free.app', 'https://intimate-upright-sunfish.ngrok-free.app', process.env.VITE_FRONTEND_URL],
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	credentials: true
}));

app.use(express.static('public'));

app.use(express.json());

server.listen(EXPRESS_PORT, '0.0.0.0', () => {
	console.log(`🚀 Express Server running on port ${EXPRESS_PORT}`);
});

startGameServer(io);
