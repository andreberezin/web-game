import manualDI from '../di/manualDI.js';
import container from '../di/container.js';

export function startGameServer(io) {

	manualDI(io);

	const socketHandler = container.resolve('socketHandler');
	socketHandler.createSocketConnection();
}
