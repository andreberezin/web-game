export default class serverStore {
	#TICK_RATE = 1000/60;
	#GAME_BOUNDS = {
		MIN_X: 0,
		MAX_X: 1920,
		MIN_Y: 0,
		MAX_Y: 1080,
	}
	#games = null

	constructor() {
		this.#games = new Map();
	}

	get TICK_RATE() {
		return this.#TICK_RATE;
	}

	set TICK_RATE(value) {
		this.#TICK_RATE = value;
	}

	get GAME_BOUNDS() {
		return this.#GAME_BOUNDS;
	}

	set GAME_BOUNDS(value) {
		this.#GAME_BOUNDS = value;
	}

	get games() {
		return this.#games;
	}

	set games(games) {
		this.#games = games;
	}

	updateGames(key, value) {
		this.#games.set(key, value);
	}
}
