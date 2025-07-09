import {clamp} from '../utils/clamp.js';

export class PlayerInputService {

	#gameService;

	constructor() {
	}

	setGameService(gameService) {
		this.#gameService = gameService;
	}

	handlePlayerMovement(game) {

		for (let playerID in game.getState.players) {
			const player = game.getState.players[playerID]

			if (player.input) {

				if (player.input.arrowUp === true) {
					player.pos.y = clamp(0, player.pos.y - player.shift, player.maxPosition.y);
					player.direction = "up";
					//console.log("Arrow up. pos.y: ", player.pos.y);
				}
				if (player.input.arrowDown === true) {
					player.pos.y = clamp(0, player.pos.y + player.shift, player.maxPosition.y);
					player.direction = "down";
					//console.log("Arrow down. pos.y: ", player.pos.y);
				}
				if (player.input.arrowLeft === true) {
					player.pos.x = clamp(0, player.pos.x - player.shift, player.maxPosition.x);
					player.direction = "left";
					//console.log("Arrow left. pos.x: ", player.pos.x);
				}
				if (player.input.arrowRight === true) {
					player.pos.x = clamp(0, player.pos.x + player.shift, player.maxPosition.x);
					player.direction = "right";
					//console.log("Arrow right. pos.x: ", player.pos.x);
				}
			}
		}
	}

	handlePlayerShooting(game) {

		for (let playerID in game.getState.players) {
			const player = game.getState.players[playerID]

			if (player.input) {

				if (player.input.space === true) {
					this.#gameService.createBulletAt(player.pos.x, player.pos.y, player.direction);
				}
			}
		}
	}
}

