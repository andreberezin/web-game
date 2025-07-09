export class Game {
	#id = null;
	#state = {
		isRunning: false,
		players: {},
		timeRemaining: 0,
		bullets: {}
	};
	#settings = {
		duration: 60000, // milliseconds = 1 minute
		maxPlayers: 4,
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

	// addPlayer(playerId, player) {
	// 	if (this.#state.players.hasOwnProperty(playerId)) {
	// 		console.error("Player: ", playerId, " already exists exist");
	// 		return;
	// 	}
	// 	this.#state.players[playerId] = player;
	// }
	//
	// removePlayer(playerId) {
	// 	if (!(this.#state.players.hasOwnProperty(playerId))) {
	// 		console.error("Player: ", playerId, " does not exist");
	// 		return;
	// 	}
	// 	delete this.#state.players[playerId]
	// }
}
