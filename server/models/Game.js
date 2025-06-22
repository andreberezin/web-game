export class Game {
	#id = null;
	#state = {
		isRunning: false,
		players: {},
		timeRemaining: 0
	};
	#settings = {
		duration: 60000, // milliseconds = 1 minute
	}

	constructor(id, settings) {
		this.#id = id;

	}

	get getState() {
		return this.#state;
	}

	set setState(updatedState) {
		this.#state = updatedState;
	}

	updateState(updatedState) {
		this.#state = {...this.#state, ...updatedState};
	}

	get getSettings() {
		return this.#settings;
	}

	set setSettings(updatedSettings) {
		this.#settings = updatedSettings;
	}

	updateSettings(updatedSettings) {
		this.#settings = {...this.#settings, ...updatedSettings};
	}

	get getId() {
		return this.#id;
	}

	set setId(newId) {
		this.#id = newId;
	}
}
