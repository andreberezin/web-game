import Player from '../models/Player.js';

export default class GameService {
	#clientStore;
	#socketHandler;
	#gameFieldService;
	#clientManager;
	#playerService;
	#playerInterfaceService;
	#gameInterfaceService;

	constructor({clientStore, socketHandler, gameFieldService, playerService, playerInterfaceService, gameInterfaceService}) {
		this.#clientStore = clientStore;
		this.#socketHandler = socketHandler;
		this.#gameFieldService = gameFieldService;
		this.#playerService = playerService;
		this.#playerInterfaceService = playerInterfaceService;
		this.#gameInterfaceService = gameInterfaceService;
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

	}

	updateGameState() {
		// todo logic from SocketHandler into smaller methods
	}
}
