export default class PlayerService {
	constructor() {
	}

	handlePlayerDeath(player) {
		player.score -= 1;
		player.lives -= 1;
		player.input = {
			space: false,
			ArrowUp: false,
			ArrowRight: false,
			ArrowLeft: false,
			ArrowDown: false
		};
		player.shift = 0;
		player.movementStart = undefined;
		player.status.alive = false;
	}
}