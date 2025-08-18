import Player from '../models/Player.js';

export default class SocketHandler {
	#io
	#gamesManager
	#gameService
	#serverStore

	constructor({io, serverStore}) {
		this.#io = io;
		this.#serverStore = serverStore;
	}

	setGamesManager(gamesManager) {
		this.#gamesManager = gamesManager;
	}

	setGameService(gameService) {
		this.#gameService = gameService;
	}

	createSocketConnection() {
		console.log("Connecting servers...");

		this.#io.of("/").adapter.on("delete-room", (room) => {
			console.log(`Room ${room} was deleted`);
		});

		this.#io.on('connection', (socket) => {
			console.log("Connected servers");

			socket.once("fetchAvailableGames", () => {
				console.log("Fetching available games");

				socket.emit('updateAvailableGames', this.getPublicGameList());
			})

			socket.on('createGame', (hostId, playerName, settings) => {
				const gameId = hostId;

				this.#gamesManager.createGame(socket, gameId, settings);

				this.joinGame(socket, gameId, hostId, playerName);

				const game = this.#serverStore.games.get(gameId);
				socket.emit("createGameSuccess", gameId);
				socket.emit("joinGameSuccess", gameId, game.state, game.settings, hostId);
			})

			socket.on('joinGame', (gameId, playerName) => {
				const game = this.#serverStore.games.get(gameId);
				if (!game) {
					console.error(`Game does not exist: ${gameId}`);
					socket.emit('error', "Game not found");
					return;
				}

				for (const playerId in game.state.players) {
					const player = game.state.players[playerId];
					if (player.name === playerName) {
						console.error(`Player already exists: ${playerId}`);
						socket.emit('error', "Player with name '"+ playerName + "' already exists in game")
						return;
					}
				}

				const playerId = socket.id;
				this.joinGame(socket, gameId, playerId, playerName);

				socket.emit("joinGameSuccess", gameId, game.state, game.settings, playerId);

				// socket.emit("joinGameSuccess", {
				// 	gameId,
				// 	state: game.state,
				// 	settings: game.settings,
				// 	myId: playerId,
				// });

				socket.to(gameId).emit("playerJoined", playerId);
			})

			socket.on('disconnect', () => {
				const playerId = socket.id;
				const gameId = socket.gameId;
				if (!gameId) return;

				const game = this.#serverStore.games.get(gameId);
				if (!game) return;

				const players = game.state.players;

				if (players[playerId]) {
					console.log('Disconnecting player: ', playerId);
					delete players[playerId];
					socket.to(gameId).emit("playerLeft", playerId);
				}
				if (Object.keys(players).length === 0) {
					console.log("Deleting game: ", gameId);
					this.#serverStore.games.delete(gameId);
				}

				if (!game.settings.private) {
					this.#io.emit('updateAvailableGames', this.getPublicGameList());
				}
			});

			// socket.on('disconnect', () => {
			// 	console.log('Disconnecting player: ',socket.id);
			// })
		})
	}


	joinGame(socket, gameId, playerId, playerName) {

		// if (gameId !== playerId) debugger;

		socket.join(gameId);
		socket.gameId = gameId;

		const player = new Player(playerId, playerName);

		this.#gameService.addPlayerToGame(gameId, playerId, player);

		const game = this.#serverStore.games.get(gameId);
		const gameState = game.state;

		console.log("Player: ", playerId, " joined game: ", gameId);

		this.#io.to(gameId).emit('myPlayerCreated', gameState.players[playerId], playerId);

		socket.on('updateMyPlayerInput', (data) => {
			let {key, type} = data;
			const player = gameState.players[playerId];

			if (!player) {
				console.error("Player not found: ", playerId);
				return;
			}

			const input = player.input

			if (key === " ") key = "space"

			type === "keydown" ? input[key] = true : input[key] = false;
		})

		if (!game.settings.private) {
			this.#io.emit('updateAvailableGames', this.getPublicGameList());
		}

		socket.on('gameStatusChange', (status) => {
			game.state.status = status;

			console.log("Game status changed: ", status);

			switch (status) {
			case "waiting":
				break;
			case "started":
				game.state.startTime = Date.now();

				if (game.state.timeRemaining > 0) {
					this.#gameService.handleGameTimer(game, socket);
				}

				this.#io.emit('updateAvailableGames', this.getPublicGameList());

				break;
			case "paused":
				break;
			case "finished":

				// clean up socket listeners
				this.removeListeners(socket);

				setTimeout(() => {
					this.#gameService.finishGame(gameId);
					this.leaveSocketRoom(socket, gameId);
				}, 1000)
				break;
			default:
				console.log("default: ", status);

			}

			this.#io.to(gameId).emit('gameStatusChangeSuccess', gameId, game.state.status);
		})
	}

	leaveSocketRoom(socket, gameId) {
		socket.leave(gameId);
	}

	removeListeners(socket) {
		socket.removeAllListeners('updateMyPlayerInput');
		socket.removeAllListeners('gameStatusChange');
	}

	// todo possibly create a DTO for this?
	getPublicGameList() {
		return Array.from(this.#serverStore.games.entries())
			// todo commented out for testing so all games can be seen on the list rather than selected games
			//eslint-disable-next-line
			// .filter(([_, game]) => !game.settings.private)
			// .filter(([_, game]) => game.state.status === "waiting")
			.map(([id, game]) => ({
				id: id,
				settings: game.settings,
				state: game.state,
				// players: Object.keys(game.state.players).length,
			}));
	}
}
