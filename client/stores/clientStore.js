export default class clientStore {
	#uiState = {
		renderLoopId: null,
	}
	#myId = null;
	#gameId = null;
	#games = new Map();
	// #currentGame = {
	// 	id: null,
	// 	state: {
	// 		players: {},
	// 		interfaces: {},
	// 		bullets: {},
	// 	},
	// 	settings: {},
	// }

	get uiState() {
		return this.#uiState;
	}

	set uiState(state) {
		this.#uiState = state;
	}

	updateUIState(state) {
		this.#uiState = {
			...this.#uiState,
			...state,
		};
	}

	get myId() {
		return this.#myId;
	}

	set myId(id) {
		this.#myId = id;
	}

	get gameId() {
		return this.#gameId;
	}

	set gameId(id) {
		this.#gameId = id;
	}

	get games() {
		return this.#games;
	}

	set games(games) {
		this.#games = games;
	}

	updateGames(games) {
		for (const [key, value] of games) {
			this.#games.set(key, value);
		}
	}

	getCurrentGame(id) {
		return this.#games.get(id);
	}

	setCurrentGame(game) {
		this.#games.set(id, game);
	}

	updateCurrentGame(game) {
		for (const [key, value] of game) {
			this.#games.set(key, value);
		}
	}
}