export default class GamesManager {
	// #TICK_RATE = 1000/60;
	// games = null;

	#io
	#gameService
	#socketHandler
	#serverStore

	constructor({io, gameService, socketHandler, serverStore}) {
		// this.games = new Map();
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

			if (game && game.state.isRunning) {
				const currentTime = Date.now();
				this.updateGame(gameId, currentTime);
				this.broadcastGameState(gameId)
				setTimeout(gameLoop, store.TICK_RATE);
			}
		}
		gameLoop();
	}

	createGame(socket, hostId, settings = {}) {
		console.log("Creating game with id: ", hostId);
		const game = this.#gameService.createGame(hostId, settings);
		game.updateState({ isRunning: true});

		// todo games doesn't need to hold the whole game object
		this.#serverStore.updateGames(game.id, game);

		// this.#io.emit("gameCreated", hostId, game.getState, game.getSettings);
		//socket.emit("gameCreated", hostId, game.getState, game.getSettings);

		this.startGameLoop(hostId);

		//this.broadcastGameId(game.getId);

		//this.socketHandler.createSocketConnection(1);
	}

	broadcastGameState(gameId) {
		const game = this.#serverStore.games.get(gameId);
		if (!game) return;


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
		if (game && game.state.isRunning) {
			this.#gameService.updateGameState(game, currentTime);
		}
	}
}
