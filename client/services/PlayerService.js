export default class PlayerService {
	// #clientManager;
	#socketHandler;
	#clientStore
	#keydownHandler = null;
	#keyupHandler = null;
	#hasListeners = false;

	constructor({playerInputService, clientStore}) {
		this.playerInputService = playerInputService;
		this.#clientStore = clientStore;
	}

	// setClientManager(clientManager) {
	// 	this.#clientManager = clientManager;
	// }

	setSocketHandler(handler) {
		this.#socketHandler = handler;
	}

	// todo what is PlayerData and what is player? do we need both?
	updatePlayerModel(timestamp, playerData, playerId) { // newPLayerData
		const store = this.#clientStore;

		let player = store.games.get(store.gameId).state.players[playerId];
		const {arrowDown, arrowUp, arrowRight, arrowLeft} = player.input;

		if (!player.element) return;

		const playerElement = document.getElementById(playerId);
		if (player.status.alive === false && playerElement) {
			playerElement.hidden = true;
			//this.removePlayerModel(playerId);
			//this.resetAcceleration(player, timestamp);
			return;
		}

		if (playerElement.hidden) {
			playerElement.hidden = false;
		}

		if (this.playerIsNotMoving(player)) {
			this.resetAcceleration(player, timestamp);
		}

		if (this.noInputFound(arrowDown, arrowUp, arrowRight, arrowLeft)) {
			player.start = undefined;
		}

		this.updateElementPosition(player);
		this.updateElementWidth(player);
	}

	noInputFound(arrowDown, arrowUp, arrowRight, arrowLeft) {
		return arrowDown === false && arrowUp === false && arrowRight === false && arrowLeft === false;
	}

	resetAcceleration(player, timestamp) {
		player.start = timestamp;
	}

	playerIsNotMoving(player) {
		return player.start === undefined;
	}

	updateElementPosition(player) {
		player.element.style.top = `${player.pos.y}px`
		player.element.style.left = `${player.pos.x}px`
	}

	updateElementWidth(player) {
		player.element.style.width = `${player.size.width}px`
	}


	createPlayerModel(playerData, playerId) {
		if (document.getElementById(playerId) !== null) {
			console.log("Player already exists!");
			return;
		}


		const store  = this.#clientStore;

		const player = store.games.get(store.gameId).state.players[playerId];
		player.pos = playerData.pos;
		player.maxPos = playerData.maxPos;
		player.name = playerData.name || playerId;


        // const numberOfPlayers = Object.keys(store.games.get(store.gameId).state.players).length;
		const indexOfPlayer = player.colorIndex || 1;

 		const playerElement = this.createElement(player, indexOfPlayer, playerId);
		this.addEventListeners(playerId);
		player.element = playerElement;

		// console.log("players", this.#clientManager.game.state.players);
		this.appendToGameField(playerElement, playerId);
	}

	appendToGameField(playerElement) {
		const gameField = document.getElementById("game-inner");
		if (!gameField) return;

		gameField.appendChild(playerElement);
		// if (playerId === this.#clientStore.myID) {
		// 	playerElement.focus();
		// }
	}

	addEventListeners(playerId) {
		if (this.#hasListeners) return;
		this.#hasListeners = true;

		//console.log("Adding event listeners");

		this.#keydownHandler = (event) => this.handleKeyPress(event, playerId);
		this.#keyupHandler = (event) => this.handleKeyPress(event, playerId);

		window.addEventListener("keydown", this.#keydownHandler);
		window.addEventListener("keyup", this.#keyupHandler);

		// window.addEventListener("keydown", (event) => {
		// 	//this.playerInputService.handleKeyDown(event, player);
		// 	this.handleKeyPress(event, playerId);
		// })
		//
		// window.addEventListener("keyup", (event) => {
		// 	//this.playerInputService.handleKeyUp(event, player);
		// 	this.handleKeyPress(event, playerId);
		// })
	}

	removeEventListeners() {
		if (!this.#hasListeners) return;
		window.removeEventListener("keydown", this.#keydownHandler);
		window.removeEventListener("keyup", this.#keyupHandler);
		this.#hasListeners = false;
		this.#keydownHandler = null;
		this.#keyupHandler = null;
	}

	handleKeyPress(event) {
		//if (event.type === 'keydown' && event.repeat) return;

		//if (event.repeat) return;

		const socket = this.#socketHandler.socket

		socket.emit('updateMyPlayerInput', {
			// playerId: playerId,
			key: event.key,
			type: event.type,
		})
	}

	createElement(player, index, playerId) {
		const playerElement = document.createElement("div")
		playerElement.classList.add("player")
		playerElement.id = `${playerId}`
		playerElement.style.top = `${player.pos.y}px`
		playerElement.style.left = `${player.pos.x}px`
		playerElement.style.width = `${player.size.width}px`
		playerElement.tabIndex = 0;

		// css variable for styling
		playerElement.style.setProperty("--name", `"${player.name}"`)
		playerElement.setAttribute("number", index);

		if (playerId === this.#clientStore.myId) {
			playerElement.classList.add("me")
		}

		return playerElement;
	}

	removePlayerModels() {
		const store = this.#clientStore;
		const {players} = store.games.get(store.gameId).state;

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
	}
}
