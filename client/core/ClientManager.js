export default class ClientManager {
	#gameService
	#gameInterfaceService
	#playerService
	#playerInterfaceService
	#socketHandler
	#clientStore
	#gameFieldService
	onGameEnd

	constructor({gameService, gameInterfaceService, playerInterfaceService, playerService, socketHandler, gameFieldService, clientStore}) {
		this.#gameService = gameService;
		this.#gameInterfaceService = gameInterfaceService
		this.#playerInterfaceService = playerInterfaceService
		this.#playerService = playerService;
		this.#socketHandler = socketHandler;
		this.#gameFieldService = gameFieldService
		this.#clientStore = clientStore;
		this.onGameEnd = null;
	}

	get socketHandler() {
		return this.#socketHandler;
	}

	startRenderLoop() {
		const store = this.#clientStore;

		if (!store.uiState.renderLoopId && store.gameId) {
			const id = requestAnimationFrame(this.renderLoop);
			store.updateUIState({renderLoopId: id});
		}
	}

	renderLoop = (timestamp) => {
		const store = this.#clientStore;
		// const currentGameId = store.gameId

		if (store.gameId && this.#socketHandler.socket) { // && store.games.get(store.gameId).state.status !== "finished"
			const game = store.games.get(store.gameId)

			// todo we're updating some things here and some things in Sockethandler...
			const {players, bullets, powerups} = game.state;
			this.#gameInterfaceService.updateGameUI(game);

			for (let bulletID in bullets) {
				if (bulletID && bullets[bulletID] != null) {
					this.#gameService.updateBulletModel(timestamp, bullets[bulletID], bulletID);
				}
			}

			if (store.games.get(store.gameId).state.status !== "finished") {
				for (let playerID in players) {
					if (playerID && players[playerID] != null) {
						this.#playerService.updatePlayerModel(timestamp, players[playerID], playerID);
					}
				}

				const myId = store.myId
				if (myId && players[myId]) {
					const me =  players[myId];
					//this.socketHandler.socket.emit("updateMyPlayerData", me.input); // me.maxPosition me.shift
					this.#playerInterfaceService.updatePlayerUI(me);
				}
			}
		}

		requestAnimationFrame(this.renderLoop);
	}


	stopRenderLoop = () => {
		const renderLoopId = this.#clientStore.uiState.renderLoopId;
		if (renderLoopId) {
			cancelAnimationFrame(renderLoopId);
			this.#clientStore.updateUIState({renderLoopId: null});
		}
	}

	clientCleanup = () => {
		const store = this.#clientStore;

		this.stopRenderLoop();

		if (store.gameId) {
			this.#gameFieldService.removeGameElements();
		}

		let socket = this.#socketHandler.socket
		if (socket) {
			socket.disconnect();
			socket = null;
		}

		this.#clientStore.myID = null;

		this.#playerService.removeEventListeners();

	}

	gameCleanup(gameId) {
		this.stopRenderLoop();
		this.#playerService.removeEventListeners();
		this.#socketHandler.cleanupGameListeners();
		this.#gameFieldService.removeGameElements();
		this.#clientStore.games.delete(gameId)
		this.#clientStore.gameId = null;
		if (this.onGameEnd) this.onGameEnd();
	}

	setupCleanup() {
		window.addEventListener("beforeunload", this.clientCleanup);
	}
}
