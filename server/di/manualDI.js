import container from './container.js';
import {asValue} from 'awilix';

export default function manualDI(io) {

	container.register({
		io: asValue(io)
	});

	const socketHandler = container.resolve('socketHandler');
	const gameService = container.resolve('gameService');
	const playerInputService = container.resolve('playerInputService');
	const gamesManager = container.resolve('gamesManager');
	const bulletService = container.resolve('bulletService');
	const powerupService = container.resolve('powerupService');

	socketHandler.setGamesManager(gamesManager);
	gameService.setGamesManager(gamesManager);
	socketHandler.setGameService(gameService);
	playerInputService.setGameService(gameService);
	bulletService.setGameService(gameService);
	powerupService.setGameService(gameService);
}
