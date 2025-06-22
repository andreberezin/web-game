import {Player} from '../models/Player.js';

export class SocketHandler {
	#io = null;

	constructor(io) {
		this.#io = io;
	}

	createSocketConnection() {
		this.#io.on('connection', (socket) => {

		})
	}


}