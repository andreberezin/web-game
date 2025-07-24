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

			socket.on('createGame', (hostId, gameSettings) => {
				const gameId = hostId;

				this.#gamesManager.createGame(socket, gameId, gameSettings);

				this.joinGame(socket, gameId, hostId);

				const game = this.#gamesManager.games.get(gameId);
				socket.emit("createGameSuccess", gameId, game.getState, game.getSettings);
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
					players: game.getState.players,
					myPlayer: game.getState.players[playerId],
				});

				socket.to(gameId).emit("playerJoined", playerId);
			})

			socket.on('disconnect', () => {
				const playerId = socket.id;
				const gameId = socket.gameId;
				if (!gameId) return;

				const game = this.#gamesManager.games.get(gameId);
				if (!game) return;

				const gameState = game.getState;

				if (gameState.players[playerId]) {
					console.log('Disconnecting player: ', playerId);
					delete gameState.players[playerId];
					socket.to(gameId).emit("playerLeft", playerId);
				}
				if (Object.keys(gameState.players).length === 0) {
					console.log("Deleting game: ", gameId);
					this.#gamesManager.games.delete(gameId);
				}

				if (!game.getSettings.private) {
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
		const gameState = game.getState;

		console.log("Player: ", playerId, " joined game: ", gameId);

		this.#io.to(gameId).emit('myPlayerCreated', gameState.players[playerId], playerId);

		socket.on('updateMyPlayerData', (input, shift, maxPosition) => {
			if (gameState.players[playerId]) {
				gameState.players[playerId].input = input;
				gameState.players[playerId].shift = shift;
				gameState.players[playerId].maxPosition = maxPosition;
			}
		});

		if (!game.getSettings.private) {
			console.log("game private: ", game.getState.private);
			this.#io.emit('updateAvailableGames', this.getPublicGameList());
		}

		// if (!socket.hasDisconnectHandler) {
		// 	socket.on('disconnect', () => {
		// 		if (gameState.players[playerId]) {
		// 			console.log('Disconnecting player: ', playerId);
		// 			delete gameState.players[playerId];
		// 			socket.to(gameId).emit("playerLeft", playerId);
		// 		}
		// 		if (Object.keys(gameState.players).length === 0) {
		// 			console.log("Deleting game: ", gameId);
		// 			this.#gamesManager.games.delete(gameId);
		// 		}
		// 		const gamesList = Array.from(this.#gamesManager.games.entries()).map(([id, game]) => ({
		// 			id: id,
		// 			settings: game.getSettings,
		// 			players: Object.keys(game.getState.players).length,
		// 		}))
		//
		// 		this.#io.emit('updateAvailableGames', gamesList);
		// 	});
		// 	socket.hasDisconnectHandler = true;
		// }
	}

	// todo possibly create a DTO for this?
	getPublicGameList() {
		const publicGamesList = Array.from(this.#gamesManager.games.entries())
			//eslint-disable-next-line
			.filter(([_, game]) => !game.getSettings.private)
			.map(([id, game]) => ({
			id: id,
			settings: game.getSettings,
			players: Object.keys(game.getState.players).length,
		}))

		return publicGamesList;
	}
}
