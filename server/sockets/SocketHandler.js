import {Player} from '../models/Player.js';

export class SocketHandler {
	#io = null;
	#gamesManager = null;
	#gameService = null;

	constructor(io) {
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

			socket.on("fetchAvailableGames", () => {
				console.log("Fetching available games");
				socket.emit('availableGames', Array.from(this.#gamesManager.games.entries()));
			})

			socket.on('createGame', (hostId) => {
				const gameId = hostId;

				this.#gamesManager.createGame(socket, gameId);

				this.joinGame(socket, gameId, hostId);

				const game = this.#gamesManager.games.get(gameId);
				socket.emit("createGameSuccess", gameId, game.getState, game.getSettings);
			})

			socket.on('joinGame', (gameId) => {
				const game = this.#gamesManager.games.get(gameId);
				if (!game) return;

				const playerId = socket.id;
				this.joinGame(socket, gameId, playerId);

				socket.emit("joinGameSuccess", {
					gameId,
					players: game.getState.players,
					myPlayer: game.getState.players[playerId],
				});

				socket.to(gameId).emit("playerJoined", playerId);
			})

			// socket.on('disconnect', () => {
			// 	console.log('Disconnecting player: ',socket.id);
			// })
		})
	}


	joinGame(socket, gameId, playerId) {
		socket.join(gameId);

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

		if (!socket.hasDisconnectHandler) {
			socket.on('disconnect', () => {
				if (gameState.players[playerId]) {
					console.log('Disconnecting player: ', playerId);
					delete gameState.players[playerId];
				}
				if (Object.keys(gameState.players).length === 0) {
					game.delete(gameId);
				}
			});
			socket.hasDisconnectHandler = true;
		}
	}
}
