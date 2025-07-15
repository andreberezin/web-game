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

		this.socketHandler.createSocketConnection(1);
	}

	broadcastGameState(gameId) {
		const game = this.games.get(gameId);
		if (game) {
			this.#io.emit('UpdateGameState', (this.games.get(gameId).getState));
		}
	}

	updateGame(gameId) {
		const game = this.games.get(gameId);
		if (game && game.getState.isRunning) {
			this.gameService.updateGameState(game);
		}
	}
}
