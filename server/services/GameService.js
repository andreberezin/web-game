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

		this.updateBullets(game);

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

	createBulletAt(x, y, direction, game) {
		const id = Math.floor(Math.random() * 10000);
		const bullet = new Bullet(id, x, y, direction);
		game.getState.bullets[id] = bullet;
	}

	updateBullets(game) {
		const bullets = game.getState.bullets;

		for(let bulletId in bullets) {
			const bullet = bullets[bulletId];

				if (bullet.direction === "up") {
					bullet.pos.y = bullet.pos.y - bullet.velocity;
				}
				if (bullet.direction === "down") {
					bullet.pos.y = bullet.pos.y + bullet.velocity;
				}
				if (bullet.direction === "left") {
					bullet.pos.x = bullet.pos.x - bullet.velocity;
				}
				if (bullet.direction === "right") {
					bullet.pos.x = bullet.pos.x + bullet.velocity;
				}

				if (bullet.pos.y < 0 || bullet.pos.y > 1000 || bullet.pos.x < 0 || bullet.pos.x > 1000) {
					delete bullets[bulletId];
				}
		}
	}

}
