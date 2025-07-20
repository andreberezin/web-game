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
				socket.join(hostId);
				this.#gamesManager.createGame(socket, hostId);
			})

			socket.on('joinGame', (gameId) => {
				const game = this.#gamesManager.games.get(gameId);

				if (game) {
					socket.join(gameId);
					this.connectToGame(gameId, socket);
					socket.emit("gameJoined", gameId);
				}
			})

			socket.on('disconnect', () => {
				console.log('Disconnecting player: ',socket.id);
			})
		})
	}

	connectToGame(gameId, socket) {
		console.log("Connecting to game...");
		const game = this.#gamesManager.games.get(gameId);
		const gameState = game.getState;
		const playerId = socket.id;

		const player = new Player(playerId);
		this.#gameService.addPlayerToGame(gameId, playerId, player);

		this.#io.to(gameId).emit('myPlayerCreated', gameState.players[playerId], playerId);

		// socket.on('createMyPlayer', () => {
		// 	const player = new Player(playerId);
		//
		// 	this.#gameService.addPlayerToGame(gameId, playerId, player);
		// 	this.#io.emit('myPlayerCreated', gameState.players[playerId], playerId);
		// });

		socket.on('updateMyPlayerData', (input, shift, maxPosition) => {
			if (gameState.players[playerId]) {
				gameState.players[playerId].input = input;
				gameState.players[playerId].shift = shift;
				gameState.players[playerId].maxPosition = maxPosition;
			}
		});

		socket.on('fetchOtherPlayers', () => {
			console.log("Fetching other players");
			socket.emit('sendOtherPlayers', (gameState.players));
		});

		socket.on('disconnect', () => {
			if (gameState.players[playerId]) {
				console.log('Disconnecting player: ',playerId);
				delete gameState.players[playerId];
			}
		});
	}

	// createSocketConnection(gameId) {
	// 	const game = this.#gamesManager.games.get(gameId);
	// 	const gameState = game.getState;
	//
	// 	this.#io.on('connection', (socket) => {
	// 		const playerId = socket.id;
	//
	// 		socket.on('createMyPlayer', () => {
	// 			const player = new Player(playerId);
	//
	// 			this.#gameService.addPlayerToGame(gameId, playerId, player);
	// 			this.#io.emit('myPlayerCreated', gameState.players[playerId], playerId);
	// 		});
	//
	// 		socket.on('fetchOtherPlayers', () => {
	// 			socket.emit('sendOtherPlayers', (gameState.players));
	// 		});
	//
	// 		// socket.on('fetchGameId', () => {
	// 		// 	socket.emit('sendGameId', (game.getId));
	// 		// });
	//
	// 		socket.on('updateMyPlayerData', (input, shift, maxPosition) => {
	// 			if (gameState.players[playerId]) {
	// 				gameState.players[playerId].input = input;
	// 				gameState.players[playerId].shift = shift;
	// 				gameState.players[playerId].maxPosition = maxPosition;
	// 			}
	// 		});
	//
	// 		socket.on('disconnect', () => {
	// 			if (gameState.players[playerId]) {
	// 				console.log('Disconnecting player: ',playerId);
	// 				delete gameState.players[playerId];
	// 			}
	// 		});
	// 	});
	// }
}
