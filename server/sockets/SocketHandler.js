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

		const gameState = game.getState; // get the correct game's state

		this.#io.on('connection', (socket) => {
			socket.on('createNewPlayer', () => {
				const player = new Player(socket.id);
				const success = this.#gameService.addPlayerToGame(gameId, socket.id, player);

				//if (success) {
				this.#io.emit('newPlayerCreated', gameState.players[socket.id], socket.id);
				//}

			});

			socket.on('fetchOtherPlayers', () => {
				socket.emit('sendOtherPlayers', (gameState.players));
				console.log('Sending player data', gameState.players);
			});

			socket.on('updatePlayerData', (input, shift, maxPosition) => {

				if (gameState.players[socket.id]) {
					gameState.players[socket.id].input = input;
					gameState.players[socket.id].shift = shift;
					gameState.players[socket.id].maxPosition = maxPosition;
				}
			});

			socket.on('disconnect', () => {
				//console.log("gamestate.players: ", gameState.players);
				if (gameState.players[socket.id]) {
					console.log('Disconnecting player: ', gameState.players[socket.id]);
					delete gameState.players[socket.id];
				}
			});
		});
	}
}
