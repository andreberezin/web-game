import {GameService} from '../services/GameService.js';
import {PlayerInputService} from '../services/PlayerInputService.js';
import {SocketHandler} from '../eventHandlers/SocketHandler.js';

export class GameEngine {
	games = null;
	#TICK_RATE= 1000/60;
	#io = null;

	constructor(io) {
		this.games = new Map();
		this.#io = io;

		// create dependency
		const playerInputService = new PlayerInputService();

		// inject dependency to gameService
		this.gameService = new GameService(playerInputService);

		this.socketHandler = new SocketHandler(io);
	}

	gameLoop(gameId) {

		this.updateGame();

		this.#io.emit('game state: ', (this.games.get(gameId)));

		setTimeout(this.gameLoop, this.#TICK_RATE);
	}

	createGame(hostId, settings) {
		const game = this.gameService.createGame(hostId, settings);
		game.updateState({ isRunning: true});
		this.gameLoop();
		this.games.set(game.getId, game);
		//return game;
	}

	updateGame(gameId, timeRemaining) {
		const game = this.games.get(gameId);
		if (game && game.getState.isRunning) {
			this.gameService.updateGameState(game, timeRemaining);
			//this.broadcastGameState(game);
		}
	}
}
