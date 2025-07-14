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

	createSocketConnection(gameId) {
		const game = this.#gamesManager.games.get(gameId);
		const gameState = game.getState;

		this.#io.on('connection', (socket) => {
			const playerId = socket.id;

			socket.on('createMyPlayer', () => {
				const player = new Player(playerId);

				this.#gameService.addPlayerToGame(gameId, playerId, player);
				this.#io.emit('myPlayerCreated', gameState.players[playerId], playerId);
			});

			socket.on('fetchOtherPlayers', () => {
				socket.emit('sendOtherPlayers', (gameState.players));
			});

			socket.on('updateMyPlayerData', (input, shift, maxPosition) => {
				if (gameState.players[playerId]) {
					gameState.players[playerId].input = input;
					gameState.players[playerId].shift = shift;
					gameState.players[playerId].maxPosition = maxPosition;
				}
			});

			socket.on('disconnect', () => {
				if (gameState.players[playerId]) {
					console.log('Disconnecting player: ', gameState.players[playerId]);
					delete gameState.players[playerId];
				}
			});
		});
	}
}
