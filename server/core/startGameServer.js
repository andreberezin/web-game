import manualDI from '../di/manualDI.js';
import container from '../di/container.js';

export function startGameServer(io) {

	// inject dependencies
	manualDI(io);

	// create the socket connection
	const socketHandler = container.resolve('socketHandler');
	socketHandler.createSocketConnection();
}
