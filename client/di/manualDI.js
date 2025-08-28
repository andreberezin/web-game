import container from './container.js';

export default function manualDI() {

	const socketHandler = container.resolve('socketHandler');
	const gameService = container.resolve('gameService');
	const playerService = container.resolve('playerService');
	const clientManager = container.resolve('clientManager');
	const gameFieldService = container.resolve('gameFieldService');
	const playerInterfaceService = container.resolve('playerInterfaceService');
	const playerInputService = container.resolve('playerInputService');

	socketHandler.setClientManager(clientManager);
	socketHandler.setGameService(gameService);
	gameService.setClientManager(clientManager);
	// playerService.setClientManager(clientManager);
	playerService.setSocketHandler(socketHandler);
	gameFieldService.setSocketHandler(socketHandler);
	playerInterfaceService.setSocketHandler(socketHandler);
	playerInputService.setSocketHandler(socketHandler);
}