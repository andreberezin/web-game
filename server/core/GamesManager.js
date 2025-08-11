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
				this.updateGame(gameId, currentTime);
				this.broadcastGameState(gameId)
				setTimeout(gameLoop, store.TICK_RATE);
			}
		}
		gameLoop();
	}

	createGame(socket, hostId, settings) {
		console.log("Creating game with id: ", hostId);
		const game = this.#gameService.createGame(hostId, settings);

		// todo move this when starting and ending game is added
		game.updateState({ isRunning: true});

		this.#serverStore.updateGames(game.id, game);

		// this.#io.emit("gameCreated", hostId, game.getState, game.getSettings);
		//socket.emit("gameCreated", hostId, game.getState, game.getSettings);

		this.startGameLoop(hostId);

		//this.broadcastGameId(game.getId);

		//this.socketHandler.createSocketConnection(1);
	}

	broadcastGameState(gameId) {
		const game = this.#serverStore.games.get(gameId);
		if (!game) {
			console.warn("Game with id:", gameId, " not found");
			return;
		}

		// console.log("game:", game.state);
		this.#io.to(gameId).emit('updateGameState', gameId, game.state);

		// const players = game.state.players;

		// if (players && players.length > 0) {
		// 	players.forEach((player) => {
		// 		console.log("player respawn timer: ", player.respawnTimer);
		// 	})
		// }
	}

	// broadcastGameId(gameId) {
	// 	this.#io.emit('updateGameId', (gameId))
	// }

	// todo broadcast game settings if needed

	updateGame(gameId, currentTime) {
		const game = this.#serverStore.games.get(gameId);
		if (game && game.state.status !== "finished") {
			this.#gameService.updateGameState(game, currentTime);
		}
	}
}
