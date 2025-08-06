export default class ClientManager {
	#gameService
	#gameInterfaceService
	#playerService
	#playerInterfaceService
	#socketHandler
	#clientStore

	constructor({gameService, gameInterfaceService, playerInterfaceService, playerService, socketHandler, clientStore}) {
		this.#gameService = gameService;
		this.#gameInterfaceService = gameInterfaceService
		this.#playerInterfaceService = playerInterfaceService
		this.#playerService = playerService;
		this.#socketHandler = socketHandler;
		this.#clientStore = clientStore;
	}

	get socketHandler() {
		return this.#socketHandler;
	}

	startRenderLoop() {
		const store = this.#clientStore;

		if (!store.uiState.renderLoopId && store.currentGame) {
			const id = requestAnimationFrame(this.renderLoop);
			store.updateUIState({renderLoopId: id});
		}
	}

	renderLoop = (timestamp) => {
		const store = this.#clientStore;
		const currentGame = store.currentGame

		if (currentGame) {
			const {players, bullets} = currentGame.state;
			const playersCount = this.#gameInterfaceService.getNumberOfPlayers(players)
			this.#gameInterfaceService.updateGameUI(store.gameId, playersCount);

			for (let playerID in players) {
				if (playerID && players[playerID] != null) {
					this.#playerService.updatePlayerModel(timestamp, players[playerID], playerID);
				}
				// todo refactor - this should be done on the backend
				if (!players[playerID].status.alive) {
					players[playerID].input.space = false;
					players[playerID].input.arrowUp = false;
					players[playerID].input.arrowDown = false;
					players[playerID].input.arrowLeft = false;
					players[playerID].input.arrowRight = false;
					players[playerID].shift = 0;
				}
			}

			for (let bulletID in bullets) {
				if (bulletID && bullets[bulletID] != null) {

					this.#gameService.updateBulletModel(timestamp, bullets[bulletID], bulletID);
				}
			}

			const myId = store.myId
			if (myId && players[myId]) {
				const me =  players[myId];
				//this.socketHandler.socket.emit("updateMyPlayerData", me.input); // me.maxPosition me.shift
				this.#playerInterfaceService.updatePlayerUI(me);
			}
		}

		requestAnimationFrame(this.renderLoop);
	}


	stopRenderLoop = () => {
		const renderLoopId = this.#clientStore.uiState.renderLoopId;
		if (renderLoopId) {
			cancelAnimationFrame(renderLoopId);
			this.#clientStore.uiState.renderLoopId = null;
		}
	}

	cleanup = () => {
		const {players} = this.#clientStore.currentGame.state;

		this.stopRenderLoop();

		for (const playerID in players) {
			delete players[playerID];

			const element = document.getElementById(playerID);
			console.log("removed player: ",  playerID);

			if (element) {
				element.remove();
			}
		}

		// cleanup for any other player elements just in case
		const elements = document.getElementsByClassName("player")

		if (elements.length > 0) {
			[...elements].forEach((element) => {element.remove()});
		}

		let socket = this.#socketHandler.socket
		if (socket) {
			socket.disconnect();
			socket = null;
		}

		this.#clientStore.myID = null;

		this.#playerService.removeEventListeners();

	}

	setupCleanup() {
		window.addEventListener("beforeunload", this.cleanup);
	}
}
