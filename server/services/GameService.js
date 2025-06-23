import {Game} from '../models/Game.js';

export class GameService {

	constructor(playerInputService, gameEngine) {

		// store the injected service
		this.playerInputService = playerInputService;
		this.gameEngine = gameEngine;
	}

	createGame(hostId, settings) {
		return new Game(hostId, settings);
	}

	updateGameState(game) {

		// handle player input
		this.playerInputService.handlePlayerMovement(game);

	}

	addPlayerToGame(gameId, playerId, player) {
		const game = this.gameEngine.games.get(gameId);
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
