export default class clientStore {
	#uiState = {
		renderLoopId: null,
		isFullscreen: false,
	}
	#myId = null;
	#gameId = null;
	#games = {};
	#currentGame = {
		id: null,
		state: {
			players: {},
			interfaces: {},
			bullets: {},
		},
		settings: {},
	}

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

	get currentGame() {
		return this.#currentGame;
	}

	set currentGame(game) {
		this.#currentGame = game;
	}

	updateCurrentGame(game) {
		this.#currentGame = {
			...this.#currentGame,
			...game,
		};
	}
}