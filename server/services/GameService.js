import {Game} from '../models/Game.js';
import {Bullet} from "../models/Bullet.js";
import {clamp} from "../utils/clamp.js";

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
		this.playerInputService.handlePlayerShooting(game);

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

	createBulletAt(x, y, direction) {
		const bullet = new Bullet(x, y, direction);

		while(bullet.pos.y < 1000 || bullet.pos.y > 1000 || bullet.pos.x < 1000 || bullet.pos.x > 1000) {
			if (bullet.direction === "up") {
				bullet.pos.y = bullet.pos.y - 100;
			}
			if (bullet.direction === "down") {
				bullet.pos.y = bullet.pos.y + 100;
			}
			if (bullet.direction === "left") {
				bullet.pos.x = bullet.pos.x - 100;
			}
			if (bullet.direction === "right") {
				bullet.pos.x = bullet.pos.x + 100;
			}
		}
	}

}
