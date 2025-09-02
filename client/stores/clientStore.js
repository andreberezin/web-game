export default class clientStore {
	#uiState = {
		renderLoopId: null,
	}
	#myId = null;
	#gameId = null;
	#games = new Map();

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
}