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
	#audioService;

	constructor({clientStore, socketHandler, gameFieldService, playerService, playerInterfaceService, gameInterfaceService, playerInputService, audioService}) {
		this.#clientStore = clientStore;
		this.#socketHandler = socketHandler;
		this.#gameFieldService = gameFieldService;
		this.#playerService = playerService;
		this.#playerInterfaceService = playerInterfaceService;
		this.#gameInterfaceService = gameInterfaceService;
		this.#playerInputService = playerInputService;
		this.#audioService = audioService;
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
		gameField.createGamefieldElement(mapType);

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

		this.#gameFieldService.createGameElement();
		this.#gameInterfaceService.createGameUI(gameId, settings, players);
		this.initializeGameField(settings.mapType, gameId, myId);
		this.initializePlayers(gameId, players, players[myId]);
		this.#clientManager.startRenderLoop();
	}

	startGame() {
		this.#gameFieldService.hideLobby();
		// this.#gameInterfaceService.createLivesDisplay();
	}

	pauseGame() {

	}

	restartGame(player) {
		// reset local visuals
		// this.#gameFieldService.removeGameElements();
		// this.#gameFieldService.createElement(this.#clientStore.games.get(this.#clientStore.gameId).settings.mapType);
		// add game ui
		// add player ui
		this.#gameFieldService.hidePauseOverlay();
		const text = `${player.name} restarted the game`
		this.#gameFieldService.showNotification(text);
		this.#gameFieldService.showLobby();

		// todo use actual player.pauses value. Currently hardcoded 2 because player.pauses isn't reset at this point yet
		this.#playerInterfaceService.updatePauseCounter(2);
	}

	endGame(gameId, playerId) {
		this.#gameFieldService.showScoreboard(playerId, gameId);
		const game = this.#clientStore.games.get(gameId);
		setTimeout(() => {
			this.#clientManager.gameCleanup(gameId);
		}, game.state.pause.duration)
	}

	leaveGame() {
		console.log("Cleaning up...");
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
		if (!game) return;

		if (status !== game.state.status) {
			switch (status) {
			case "waiting":
				if (game.state.status === "paused") {
					this.restartGame(game.state.players[playerId]);
				}
				break;
			case "started":
				if (game.state.status === "waiting") { // so this is not triggered when status is changed from "paused" to "started"
					this.#audioService.playStart();
					this.startGame();
					this.#gameFieldService.hidePauseOverlay();
				}

				// Always re-enable MY pause button if I still have pauses left
				if (game.state.players[myId].pauses > 0) {
					this.#playerInterfaceService.enablePauseButton();
				}

				if (game.state.status === "paused") {
					const player = this.#clientStore.games.get(gameId).state.players[playerId]
					let text

					// if player leaves during the pause
					if (player) {
						text = `Game resumed by ${player.name}`;
					} else {
						text = `Game resumed`;
					}
					this.#gameFieldService.showNotification(text);

					this.#gameFieldService.togglePauseOverlay();
				}
				break;
			case "paused":
				this.pauseGame();
				this.#gameFieldService.showPauseOverlay();
				// this.#gameFieldService.updatePausedBy(gameId, playerId);

				const playerName = this.#clientStore.games.get(gameId).state.players[playerId].name;
				const text = `Game paused by ${playerName}`;
				this.#gameFieldService.showNotification(text);

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
				this.endGame(gameId, playerId);
				break;
			default:
				console.log("default: ", status);
				break;
			}

			this.#clientStore.games.get(gameId).state.status = status;
		}

	}
}
