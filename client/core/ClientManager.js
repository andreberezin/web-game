export default class ClientManager {
	// todo refactor so current game data is not duplicated. Currently in game and games[currentGameId]}
	game = {
		id: null,
		state: {
			players: {},
			interfaces: {},
			bullets: {}
		},
		settings: {
		}
	};
	myID = null;
	currentGameId = null;
	#renderLoopId = null;
	games = null;

	constructor({gameService, gameFieldService, gameInterfaceService, playerInterfaceService, playerService, socketHandler}) {
		this.gameService = gameService;
		this.gameFieldService = gameFieldService;
		this.gameInterfaceService = gameInterfaceService
		this.playerInterfaceService = playerInterfaceService
		this.playerService = playerService;
		this.socketHandler = socketHandler;

		this.games = new Map();
	}

	startRenderLoop() {
		if (!this.#renderLoopId && this.game) {
			requestAnimationFrame(this.renderLoop);
		}
	}

	renderLoop = (timestamp) => {
		const {players, bullets} = this.game.state;

		if (this.game) {
			const playersCount = this.gameInterfaceService.getNumberOfPlayers(players)
			this.gameInterfaceService.updateGameUI(this.game.id, playersCount);


			for (let playerID in players) {
				if (playerID && players[playerID] != null) {
					this.playerService.updatePlayerModel(timestamp, players[playerID], playerID);
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

					this.gameService.updateBulletModel(timestamp, bullets[bulletID], bulletID);
				}
			}

			if (this.myID && players[this.myID]) {
				const me =  players[this.myID];
				//this.socketHandler.socket.emit("updateMyPlayerData", me.input); // me.maxPosition me.shift
				this.playerInterfaceService.updatePlayerUI(me);
			}

			this.#renderLoopId = requestAnimationFrame(this.renderLoop);
		}
	}


	stopRenderLoop = () => {
		if (this.#renderLoopId) {
			cancelAnimationFrame(this.#renderLoopId);
			this.#renderLoopId = null;
		}
	}

	cleanup = () => {
		const {players} = this.game.state;

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
			elements.forEach((element) => {element.remove()});
		}

		if (this.socketHandler.socket) {
			this.socketHandler.socket.disconnect();
			this.socketHandler.socket = null;
		}

		this.myID = null;
	}

	setupCleanup() {
		window.addEventListener("beforeunload", this.cleanup);
	}
}
