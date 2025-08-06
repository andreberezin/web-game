export default class serverStore {
	#TICK_RATE = 1000/60;
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
