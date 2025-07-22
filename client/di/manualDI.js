import container from './container.js';

export default function manualDI() {

	const socketHandler = container.resolve('socketHandler');
	const gameService = container.resolve('gameService');
	const playerService = container.resolve('playerService');
	const clientManager = container.resolve('clientManager');

	socketHandler.setClientManager(clientManager);
	socketHandler.setGameService(gameService);
	gameService.setClientManager(clientManager);
	playerService.setClientManager(clientManager);
}