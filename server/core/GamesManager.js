export class GamesManager {
	#TICK_RATE = 1000/60;
	#io = null;
	games = null;

	constructor(io, gameService, socketHandler) {
		this.games = new Map();
		this.#io = io;
		this.gameService = gameService;
		this.socketHandler = socketHandler;
	}

	startGameLoop(gameId) {
		const gameLoop = () => {
			const game = this.games.get(gameId);

			if (game && game.getState.isRunning) {
				const currentTime = Date.now();
				this.updateGame(gameId, currentTime);
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

		//this.broadcastGameId(game.getId);

		this.socketHandler.createSocketConnection(1);
	}

	broadcastGameState(gameId) {
		const game = this.games.get(gameId);
		if (game) {
			this.#io.emit('updateGameState', gameId, game.getState);
		}
	}

	// broadcastGameId(gameId) {
	// 	this.#io.emit('updateGameId', (gameId))
	// }

	// todo broadcast game settings if needed

	updateGame(gameId, currentTime) {
		const game = this.games.get(gameId);
		if (game && game.getState.isRunning) {
			this.gameService.updateGameState(game, currentTime);
		}
	}
}
