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

	assignColorIndex(game) {
		const COLORS = [1,2,3,4];
		const used = new Set(
			Object.values(game.state.players)
				.map(p => p.colorIndex)
				.filter(v => Number.isInteger(v))
		);
		for (const c of COLORS) if (!used.has(c)) return c;
		// fallback if > 4 players: rotate
		return ((Object.keys(game.state.players).length) % COLORS.length) + 1;
	}
}