export default class Game {
	#id = null;
	#state = {
		isRunning: false,
		players: {},
		deadPlayers: {},
		timeRemaining: 0,
		bullets: {}
	};
	#settings = {
		private: false,
		duration: 60000, // milliseconds = 1 minute
		maxPlayers: 4,
		gameField: "empty"
	}

	constructor(id, settings = {}) {
		this.#id = id;
		this.#settings = {
			...this.#settings,
			...settings
		};
	}

	get id() {
		return this.#id;
	}

	set id(newId) {
		this.#id = newId;
	}

	get state() {
		return this.#state;
	}

	set state(updatedState) {
		this.#state = updatedState;
	}

	updateState(updatedState) {
		this.#state = {...this.#state, ...updatedState};
	}

	get settings() {
		return this.#settings;
	}

	set settings(updatedSettings) {
		this.#settings = updatedSettings;
	}

	updateSettings(updatedSettings) {
		this.#settings = {...this.#settings, ...updatedSettings};
	}
}
