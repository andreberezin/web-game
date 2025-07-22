export default class ClientManager {
	game = {
		id: null,
		state: {
			players: {},
			interfaces: {},
			bullets: {}
		},
	};
	myID = null;
	#renderLoopId = null;
	games = null;

	constructor({gameService, gameInterfaceService, playerInterfaceService, playerService, socketHandler}) {
		this.gameService = gameService;
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
			}

			for (let bulletID in bullets) {
				if (bulletID && bullets[bulletID] != null) {

					this.gameService.updateBulletModel(timestamp, bullets[bulletID], bulletID);
				}
			}

			if (this.myID && players[this.myID].input) {
				const me =  players[this.myID];
				this.socketHandler.socket.emit("updateMyPlayerData", me.input, me.getShift, me.getMaxPosition);
				//console.log("updateMyPlayerData: ", me);
				this.playerInterfaceService.updatePlayerUI(this.myID);
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
