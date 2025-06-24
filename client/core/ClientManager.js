
export class ClientManager {
	game = {
		state: null,
		players: null,
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
			console.log("game: ", this.game);
			requestAnimationFrame(this.renderLoop);
		}
	}

	renderLoop(timestamp) {

		for (let playerID in this.game.state.players) {
			if (playerID && this.game.state.players[playerID] != null) {

				this.playerService.updatePlayerModel(timestamp, this.game.state.players[playerID], playerID);
			}
		}

		if (this.myID) {
			this.socketHandler.socket.emit("updatePlayerData", this.game.state.players[this.myID].input, this.game.state.players[this.myID].getShift, this.game.state.players[this.myID].getMaxPosition);
		}

		this.#renderLoopId = requestAnimationFrame(this.renderLoop)
	}


	stopRenderLoop() {

		if (this.#renderLoopId) {
			cancelAnimationFrame(this.#renderLoopId);
			this.#renderLoopId = null;
		}
	}

	cleanup() {
		console.log("cleaning up");

		this.stopRenderLoop();

		for (const playerID in this.game.state.players) {
			//this.playerService.removePlayer(playerID);
			delete this.game.state.players[playerID];
			document.getElementById(this.socketHandler.socket.id).remove();
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
