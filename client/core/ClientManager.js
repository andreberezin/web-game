
export class ClientManager {
	game = {
		state: {
			players: {},
			bullets: {}
		},
	};
	myID = null;
	#renderLoopId = null;

	constructor(gameService, playerService, socketHandler) {
		this.gameService = gameService;
		this.playerService = playerService;
		this.socketHandler = socketHandler;

	}


	startRenderLoop() {
		console.log("Starting render loop");
		if (!this.#renderLoopId && this.game) {
			//console.log("game: ", this.game);
			requestAnimationFrame(this.renderLoop);
		}
	}

	renderLoop = (timestamp) => {

		if (this.game) {
			//console.log("GAME");
			for (let playerID in this.game.state.players) {
				if (playerID && this.game.state.players[playerID] != null) {

					this.playerService.updatePlayerModel(timestamp, this.game.state.players[playerID], playerID);
				}
			}

			for (let bulletID in this.game.state.bullets) {
				if (bulletID && this.game.state.bullets[bulletID] != null) {

					this.gameService.updateBulletModel(timestamp, this.game.state.bullets[bulletID], bulletID);
				}
			}

			if (this.myID) {
				//console.log("myId", this.myID)
				const me =  this.game.state.players[this.myID];
				this.socketHandler.socket.emit("updateMyPlayerData", me.input, me.getShift, me.getMaxPosition);
			}

			this.#renderLoopId = requestAnimationFrame(this.renderLoop);
		}
	}


	stopRenderLoop = () => {
		console.log("Stopping render loop");

		if (this.#renderLoopId) {
			cancelAnimationFrame(this.#renderLoopId);
			this.#renderLoopId = null;
		}
	}

	cleanup = () => {
		console.log("Cleaning up");

		this.stopRenderLoop();

		// if (this.#renderLoopId) {
		// 	console.log("Stopping render loop");
		// 	cancelAnimationFrame(this.#renderLoopId);
		// 	this.#renderLoopId = null;
		// }

		// cleanup existing player elements
		for (const playerID in this.game.state.players) {
			//this.playerService.removePlayer(playerID);
			delete this.game.state.players[playerID];
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
