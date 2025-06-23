import {Player} from '../models/Player.js';

export class SocketHandler {
	#io = null;
	#gameEngine = null;
	#gameService = null;

	constructor(io, gameEngine) {
		this.#io = io;
		this.#gameEngine = gameEngine;
		this.#gameService = gameEngine.gameService;
	}

	createSocketConnection(gameId) {
		const game = this.#gameEngine.games.get(gameId);

		const gameState = this.#gameEngine.games.get(gameId).getState; // get the correct game's state

		this.#io.on('connection', (socket) => {
			socket.on('createNewPlayer', () => {
				const player = new Player(socket.id)
				const success = this.#gameService.addPlayerToGame(gameId, socket.id, player);

				//if (success) {
					this.#io.emit('newPlayerCreated', gameState.players[socket.id], socket.id);
				//}

			})

			socket.on('fetchOtherPlayers', () => {
				socket.emit('sendOtherPlayers', (gameState.players));
			})

			socket.on('updatePlayerData', (input, shift, maxPosition) => {

				if (gameState.players[socket.id]) {
					gameState.players[socket.id].input = input;
					gameState.players[socket.id].shift = shift;
					gameState.players[socket.id].maxPosition = maxPosition;
				}
			});

			socket.on('disconnect', () => {
				console.log("gamestate.players: ", gameState.players);
				if (gameState.players[socket.id]) {
					delete gameState.players[socket.id];
				}
			});
		})
	}
}
