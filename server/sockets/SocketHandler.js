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
			const playerId = socket.id;

			socket.on('createNewPlayerAndFetchOtherPlayers', () => {
				const player = new Player(playerId);
				//const success;
				this.#gameService.addPlayerToGame(gameId, playerId, player);
				//console.log("createnewplayer in side heere")
				//if (success) {
				this.#io.emit('newPlayerCreatedAndSendingOtherPlayers', gameState.players[playerId], playerId, gameState.players);
				//}

			});

			/*socket.on('fetchOtherPlayers', () => {
				socket.emit('sendOtherPlayers', (gameState.players));
				//console.log('Sending player data', gameState.players);
			});*/

			socket.on('updateMyPlayerData', (input, shift, maxPosition) => {
				//console.log("shift:", shift);
				if (gameState.players[playerId]) {
					gameState.players[playerId].input = input;
					gameState.players[playerId].shift = shift;
					gameState.players[playerId].maxPosition = maxPosition;
				}
			});

			socket.on('disconnect', () => {
				//console.log("gamestate.players: ", gameState.players);
				if (gameState.players[playerId]) {
					console.log('Disconnecting player: ', gameState.players[playerId]);
					delete gameState.players[playerId];
				}
			});
		});
	}
}
