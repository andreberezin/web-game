import {PlayerInputService} from '../services/PlayerInputService.js';
import {GameService} from '../services/GameService.js';
import {SocketHandler} from '../sockets/SocketHandler.js';
import {GamesManager} from './GamesManager.js';

export function startGameServer(io) {
	const gamesManager = createGamesManager(io);
	gamesManager.createGame(1);
	gamesManager.startGameLoop(1);
}

function createGamesManager(io) {
	// handle dependency injection
	const playerInputService = new PlayerInputService();
	const gameService = new GameService(playerInputService);
	const socketHandler = new SocketHandler(io);
	const gamesManager = new GamesManager(io, gameService, socketHandler);

	socketHandler.setGamesManager(gamesManager);
	gameService.setGamesManager(gamesManager);
	playerInputService.setGameService(gameService);

	return gamesManager;
}
