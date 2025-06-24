import {Game} from '../models/Game.js';

export class GameService {

	#gamesManager;

	constructor(playerInputService) {
		this.playerInputService = playerInputService;
	}

	setGamesManager(gamesManager) {
		this.#gamesManager = gamesManager;
	}

	createGame(hostId, settings) {
		return new Game(hostId, settings);
	}

	updateGameState(game) {

		// handle player input
		this.playerInputService.handlePlayerMovement(game);

	}

	addPlayerToGame(gameId, playerId, player) {
		const game = this.#gamesManager.games.get(gameId);
		if (!game) {
			return { success: false, reason: 'Game not found' };
		}

		let result;

		if (Object.keys(game.getState.players).length < game.getSettings.maxPlayers) {
			game.getState.players[playerId] = player;
			result = true;
		}
		result = false;

		// if (result) {
		// 	this.broadcastPlayerJoined(gameId, playerId, result.player);
		// }

		return result;
	}


}
