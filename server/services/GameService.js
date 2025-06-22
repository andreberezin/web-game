import {Game} from '../models/Game.js';

export class GameService {

	constructor(playerInputService) {

		// store the injected service
		this.playerInputService = playerInputService;
	}

	createGame(hostId, settings) {
		return new Game(hostId, settings);
	}

	updateGameState(game, timeRemaining) {

		// handle player input
		this.playerInputService.handlePlayerMovement(game);

	}
}
