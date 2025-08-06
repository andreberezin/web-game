// manual wiring to handle some circular dependency situations
import container from './container.js';
import {asValue} from 'awilix';

export default function manualDI(io) {

	container.register({
		io: asValue(io),
	})

	const socketHandler = container.resolve('socketHandler');
	const gameService = container.resolve('gameService');
	const playerInputService = container.resolve('playerInputService');
	const gamesManager = container.resolve('gamesManager');

	socketHandler.setGamesManager(gamesManager);
	socketHandler.setGameService(gameService);
	playerInputService.setGameService(gameService);
}
