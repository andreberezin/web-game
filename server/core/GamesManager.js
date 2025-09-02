export default class GamesManager {
	#io;
	#gameService;
	#socketHandler;
	#serverStore;

	constructor({io, gameService, socketHandler, serverStore}) {
		this.#io = io;
		this.#gameService = gameService;
		this.#socketHandler = socketHandler;
		this.#serverStore = serverStore;
	}

	startGameLoop(gameId) {
		const store = this.#serverStore;

		const gameLoop = () => {
			const game = store.games.get(gameId);

			if (game) {
				const currentTime = Date.now();
				this.updateGame(game, currentTime);
				this.broadcastGameState(game);
				setTimeout(gameLoop, store.TICK_RATE);
			}
		};
		gameLoop();
	}

	createGame(socket, hostId, settings) {

		if (!this.#gameService.canCreateGame(hostId)) {
			throw new Error(`Game with id ${hostId} already exists`);
		}

		const game = this.#gameService.createGame(hostId, settings);

		game.updateState({isRunning: true});

		this.#serverStore.updateGames(game.id, game);
		this.#gameService.generateWalls(game);
		this.startGameLoop(hostId);

		return game;
	}

	broadcastGameState(game) {
		if (!this.#serverStore.games.has(game.id) || !game) return;
		this.#io.to(game.id).emit('updateGameState', game.id, game.state);
	}

	updateGame(game, currentTime) {
		this.#gameService.updateGameState(game, currentTime);
	}

	deleteGame(gameId) {
		this.#serverStore.games.delete(gameId);
	}

	// todo possibly create a DTO for this?
	getPublicGameList() {
		return Array.from(this.#serverStore.games.entries())
			// todo commented out for testing so all games can be seen on the list rather than selected games
			// KEEP COMMENTED OUT CODE!!!
			//eslint-disable-next-line
			// .filter(([_, game]) => !game.settings.private)
			// .filter(([_, game]) => game.state.status === "waiting")
			// .filter(([_, game]) => Object.keys(game.state.players).length < game.settings.maxPlayers)
			.map(([id, game]) => ({
				id: id,
				settings: game.settings,
				state: game.state
			}));
	}
}
