export default class clientStore {

	constructor() {
		this.state = {
			playerId: null,
			gameId: null,
			settings: {},
			games: {},
			isFullscreen: false,
		};
	}

	set(key, value) {
		this.state[key] = value;
	}

	get(key) {
		return this.state[key];
	}

	update(updates) {
		Object.assign(this.state, updates);
	}
}