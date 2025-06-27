
export class ClientManager {
	game = {
		state: {
			players: {}
		},
	};
	myID = null;
	#renderLoopId = null;

	constructor(gameService, playerService, socketHandler) {
		this.gameservice = gameService;
		this.playerService = playerService;
		this.socketHandler = socketHandler;

	}


	startRenderLoop() {
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

			console.log("myId", this.myID)
			if (this.myID) {
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

		for (const playerID in this.game.state.players) {
			//this.playerService.removePlayer(playerID);
			delete this.game.state.players[playerID];
			const element = document.getElementById(playerID);

			if (element) {
				element.remove();
			}
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
