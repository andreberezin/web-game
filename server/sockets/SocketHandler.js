import Player from '../models/Player.js';

export default class SocketHandler {
	#io = null;
	#gamesManager = null;
	#gameService = null;

	constructor({io}) {
		this.#io = io;
	}

	setGamesManager(gamesManager) {
		this.#gamesManager = gamesManager;
		this.#gameService = this.#gamesManager.gameService;
	}

	createSocketConnection() {
		console.log("Connecting servers...");

		this.#io.on('connection', (socket) => {
			console.log("Connected servers");

			socket.once("fetchAvailableGames", () => {
				console.log("Fetching available games");

				socket.emit('updateAvailableGames', this.getPublicGameList());
			})

			socket.on('createGame', (hostId, settings) => {
				const gameId = hostId;

				this.#gamesManager.createGame(socket, gameId, settings);

				this.joinGame(socket, gameId, hostId);

				const game = this.#gamesManager.games.get(gameId);
				socket.emit("createGameSuccess", gameId, game.state, game.settings);
				socket.emit("joinGameSuccess", {
					gameId,
					players: game.state.players,
					myPlayer: game.state.players[hostId],
				});
			})

			socket.on('joinGame', (gameId) => {
				const game = this.#gamesManager.games.get(gameId);
				if (!game) {
					socket.emit('joinGameFailed', gameId);
					return;
				}

				const playerId = socket.id;
				this.joinGame(socket, gameId, playerId);

				socket.emit("joinGameSuccess", {
					gameId,
					players: game.state.players,
					myPlayer: game.state.players[playerId],
				});

				socket.to(gameId).emit("playerJoined", playerId);
			})

			socket.on('disconnect', () => {
				const playerId = socket.id;
				const gameId = socket.gameId;
				if (!gameId) return;

				const game = this.#gamesManager.games.get(gameId);
				if (!game) return;

				const players = game.state.players;

				if (players[playerId]) {
					console.log('Disconnecting player: ', playerId);
					delete players[playerId];
					socket.to(gameId).emit("playerLeft", playerId);
				}
				if (Object.keys(players).length === 0) {
					console.log("Deleting game: ", gameId);
					this.#gamesManager.games.delete(gameId);
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


	joinGame(socket, gameId, playerId) {
		socket.join(gameId);
		socket.gameId = gameId;

		const player = new Player(playerId);
		this.#gameService.addPlayerToGame(gameId, playerId, player);

		const game = this.#gamesManager.games.get(gameId);
		const gameState = game.state;

		console.log("Player: ", playerId, " joined game: ", gameId);

		this.#io.to(gameId).emit('myPlayerCreated', gameState.players[playerId], playerId);

		// socket.on('updateMyPlayerData', (input) => {
		// 	const player = gameState.players[playerId];
		// 	if (player) {
		// 		player.input = input;
		// 		//player.shift = shift;
		// 		//player.maxPosition = maxPosition;
		// 	}
		// });

		socket.on('updateMyPlayerInput', (data) => {
			let {key, type} = data;
			const player = gameState.players[playerId];

			if (!player) {
				console.log("Player not found: ", playerId);
				return;
			}

			const input = player.input

			if (key === " ") key = "space"

			type === "keydown" ? input[key] = true : input[key] = false;
		})

		if (!game.settings.private) {
			this.#io.emit('updateAvailableGames', this.getPublicGameList());
		}
	}

	// todo possibly create a DTO for this?
	getPublicGameList() {
		return Array.from(this.#gamesManager.games.entries())
			//eslint-disable-next-line
			.filter(([_, game]) => !game.settings.private)
			.map(([id, game]) => ({
				id: id,
				settings: game.settings,
				players: Object.keys(game.state.players).length,
			}));
	}
}
