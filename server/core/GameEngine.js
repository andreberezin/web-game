import {GameService} from '../services/GameService.js';
import {PlayerInputService} from '../services/PlayerInputService.js';
import {SocketHandler} from '../eventHandlers/SocketHandler.js';

export class GameEngine {
	#TICK_RATE = 1000/60;
	#io = null;
	games = null;

	constructor(io) {
		this.games = new Map();
		this.#io = io;
		//this.#TICK_RATE = 1000/60;

		// create dependency
		const playerInputService = new PlayerInputService();

		// inject dependency to gameService
		this.gameService = new GameService(playerInputService, this);

		this.socketHandler = new SocketHandler(io, this);
	}

	startGameLoop(gameId) {

		const gameLoop = () => {
			const game = this.games.get(gameId);

			//console.log("LOOP IS RUNNING");

			if (game && game.getState.isRunning) {
				this.updateGame(gameId);
				this.broadcastGameState(gameId)
				setTimeout(gameLoop, this.#TICK_RATE);
			}
		}

		gameLoop();
	}

	createGame(hostId, settings = {}) {
		const game = this.gameService.createGame(hostId, settings);
		game.updateState({ isRunning: true});
		this.games.set(game.getId, game);
		this.startGameLoop(hostId);
		//return game;
		this.socketHandler.createSocketConnection(1);
	}

	broadcastGameState(gameId) {
		const game = this.games.get(gameId);
		if (game) {
			this.#io.emit('game state', (this.games.get(gameId).getState));
			//console.log("input: ", this.games.get(gameId).getState.players);
		}
	}

	updateGame(gameId) {
		const game = this.games.get(gameId);
		if (game && game.getState.isRunning) {
			this.gameService.updateGameState(game);
			//this.broadcastGameState(game);
		}
	}

}
