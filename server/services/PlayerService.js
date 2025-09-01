export default class PlayerService {
	// todo move player related methods from GameService to here

	constructor() {}

	handlePlayerDeath(player) {
		// console.log(`${player.name} dead`);

		player.score -= 1;
		player.lives -= 1;
		player.input = {
			space: false,
			ArrowUp: false,
			ArrowRight: false,
			ArrowLeft: false,
			ArrowDown: false};
		player.shift = 0;
		player.movementStart = undefined;
		player.status.alive = false;
	}
}