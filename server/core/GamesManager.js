export default class GamesManager {
	#io
	#gameService
	#socketHandler
	#serverStore

	constructor({io, gameService, socketHandler, serverStore}) {
		this.#io = io;
		this.#gameService = gameService;
		this.#socketHandler = socketHandler;
		this.#serverStore = serverStore;
	}

	startGameLoop(gameId) {
		const store = this.#serverStore

		console.log("Starting Game Loop");
		const gameLoop = () => {
			const game = store.games.get(gameId);

			if (game) {
				const currentTime = Date.now();
				this.updateGame(game, currentTime);
				this.broadcastGameState(game)
				setTimeout(gameLoop, store.TICK_RATE);
			} else {
				throw new Error(`Game ${gameId} not found`);
			}
		}
		gameLoop();
	}

	createGame(socket, hostId, settings) {

		if (!this.#gameService.canCreateGame(hostId)) {
			throw new Error(`Game with id ${hostId} already exists`);
		}

		console.log("Creating game with id: ", hostId);
		const game = this.#gameService.createGame(hostId, settings);

		// todo move this when starting and ending game is added
		game.updateState({ isRunning: true});

		this.#serverStore.updateGames(game.id, game);

		this.startGameLoop(hostId);

		return game;
	}

	broadcastGameState(game) {
		// const game = this.#serverStore.games.get(gameId);
		// if (!game) {
		// 	throw new Error(`Game with id ${gameId} not found`);
		// }

		this.#io.to(game.id).emit('updateGameState', game.id, game.state);
	}

	// todo broadcast game settings if needed

	updateGame(game, currentTime) {
		// const game = this.#serverStore.games.get(gameId);
		// if (game) { // && game.state.status !== "finished"
		// 	this.#gameService.updateGameState(game, currentTime);
		// }
		this.#gameService.updateGameState(game, currentTime);
	}

	deleteGame(gameId) {
		console.log("Deleting game: ", gameId);
		this.#serverStore.games.delete(gameId);
	}
}
