import Player from '../models/Player.js';

export default class GameService {
	#clientStore;
	#socketHandler;
	#gameFieldService;
	#clientManager;
	#playerService;
	#playerInterfaceService;
	#gameInterfaceService;
	#playerInputService;

	constructor({clientStore, socketHandler, gameFieldService, playerService, playerInterfaceService, gameInterfaceService, playerInputService}) {
		this.#clientStore = clientStore;
		this.#socketHandler = socketHandler;
		this.#gameFieldService = gameFieldService;
		this.#playerService = playerService;
		this.#playerInterfaceService = playerInterfaceService;
		this.#gameInterfaceService = gameInterfaceService;
		this.#playerInputService = playerInputService;
	}

	setClientManager(clientManager) {
		this.#clientManager = clientManager;
	}

	initializePlayers(gameId, players, myPlayer) {
		if (!this.#clientStore.myId) {
			this.#clientStore.myId = myPlayer.id;
		}

		const gameState = this.#clientStore.games.get(gameId).state;
		let currentIndex = Object.keys(gameState.players).length

		for (const playerID in players) {
			// if (!gameState.players[playerID]) {
			currentIndex++;
			gameState.players[playerID] = new Player(playerID, players[playerID].name);
			gameState.players[playerID].colorIndex = currentIndex;
			this.#playerService.createPlayerModel(players[playerID], playerID);

			// todo I don't think it's necessary to create the playerInterface object and save it for each player
			//gameState.interfaces[playerID] = new PlayerInterface(playerID);

			//}

			if (playerID === myPlayer.id) {
				this.#playerInterfaceService.createPlayerUI();
			}
		}
	}

	initializeGameField(mapType, gameId, myId) {
		const gameField = this.#gameFieldService
		gameField.createElement(mapType);

		const game = this.#clientStore.games.get(gameId);

		if (gameId === myId) {
			// create and append start game button
			gameField.createStartButton(game);
		} else {
			// create and append a message that says, "Waiting for the host to start the game..."
		}
	}

	createGame(gameId, myId) {
		const game  = this.#clientStore.games.get(gameId);

		const players = game.state.players;
		const settings = game.settings;

		this.initializeGameField(settings.mapType, gameId, myId);
		this.initializePlayers(gameId, players, players[myId]);
		this.#gameInterfaceService.createGameUI(gameId, settings, players);
		this.#clientManager.startRenderLoop();
	}

	startGame() {
		this.#gameFieldService.hideLobby();
	}

	pauseGame() {

	}

	endGame(gameId) {
		this.#gameFieldService.showScoreboard();
		setTimeout(() => {
			this.#clientManager.gameCleanup(gameId);
		}, 1000)
	}

	leaveGame() {
		this.#clientManager.stopRenderLoop();
		this.#playerInputService.removeEventListeners();
		this.#socketHandler.cleanupGameListeners();
		this.#gameFieldService.removeGameElements();
		this.#clientStore.gameId = null;
		if (this.#clientManager.onGameEnd) this.#clientManager.onGameEnd();
	}

	updateGameState() {
		// todo logic from SocketHandler into smaller methods
	}

	updateGameStatus(gameId, status, playerId) {
		const myId = this.#clientStore.myId;
		const game = this.#clientStore.games.get(gameId);

		switch (status) {
		case "waiting":
			break;
		case "started":
			if (this.#clientStore.games.get(gameId).state.status === "waiting") { // so this is not triggered when status is changed from "paused" to "started"
				this.startGame();
			}

			// Always re-enable MY pause button if I still have pauses left
			if (game.state.players[myId].pauses > 0) {
				this.#playerInterfaceService.enablePauseButton();
			}

			this.#gameFieldService.togglePauseOverlay();
			break;
		case "paused":
			this.pauseGame();
			this.#gameFieldService.togglePauseOverlay();
			this.#gameFieldService.updatePausedBy(gameId, playerId);

			// Only decrement my pauses if *I* was the one who paused
			if (playerId === myId) {
				const pauseCount = game.state.players[myId].pauses - 1;
				this.#playerInterfaceService.updatePauseCounter(pauseCount);

				if (pauseCount <= 0) {
					this.#playerInterfaceService.disablePauseButton();
					console.log("pause disabled");
				} else {
					this.#playerInterfaceService.enablePauseButton();
					console.log("pause still available");
				}
			}
			break;
		case "finished":
			this.endGame(gameId);
			break;
		default:
			console.log("default: ", status);
			break;
		}

		this.#clientStore.games.get(gameId).state.status = status;
	}
}
