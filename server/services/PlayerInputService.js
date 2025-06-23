import {clamp} from '../utils/Clamp.js';

export class PlayerInputService {

	constructor() {
	}

	handlePlayerMovement(game) {

		for (let playerID in game.getState.players) {
			const player = game.getState.players[playerID]

			if (player.input) {

				if (player.input.arrowUp === true) {
					player.pos.y = clamp(0, player.pos.y - player.shift, player.maxPosition.y);
					console.log("Arrow up. pos.y: ", player.pos.y);
				}
				if (player.input.arrowDown === true) {
					player.pos.y = clamp(0, player.pos.y + player.shift, player.maxPosition.y);
					console.log("Arrow down. pos.y: ", player.pos.y);
				}
				if (player.input.arrowLeft === true) {
					player.pos.x = clamp(0, player.pos.x - player.shift, player.maxPosition.x);
					console.log("Arrow left. pos.x: ", player.pos.x);
				}
				if (player.input.arrowRight === true) {
					player.pos.x = clamp(0, player.pos.x + player.shift, player.maxPosition.x);
					console.log("Arrow right. pos.x: ", player.pos.x);
				}
			}
		}
	}
}

