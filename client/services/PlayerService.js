export default class PlayerService {
	#socketHandler;
	#clientStore
	#playerInputService;

	constructor({clientStore, playerInputService}) {
		this.#clientStore = clientStore;
		this.#playerInputService = playerInputService;
	}


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
			return;
		}

		if (playerElement) {
			if (playerElement.hidden === true) {
				playerElement.hidden = false;
			}
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

	getScore(player) {
		return player.lives + player.kills;
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

		const indexOfPlayer = player.colorIndex || 1;

 		const playerElement = this.createElement(player, indexOfPlayer, playerId);
		this.#playerInputService.addEventListeners(playerId);
		player.element = playerElement;

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

	createElement(player, index, playerId) {

		// create outer element for player with absolute positioning
		const playerElement = document.createElement("div");
		playerElement.classList.add("player");
		playerElement.id = `${playerId}`;
		playerElement.style.top = `${player.pos.y}px`;
		playerElement.style.left = `${player.pos.x}px`;
		playerElement.style.width = `${player.size.width}px`;
		playerElement.tabIndex = 0;

		// create inner element for player with relative positioning
		const playerInner = document.createElement("div");
		playerInner.classList.add("player-inner");

		// create parts for the inner element for player with absolute positioning in regards to the inner element
		const playerBody = document.createElement("div");
		playerBody.classList.add("player-body");
		const playerName = document.createElement("div");
		playerName.classList.add("player-name");
		playerName.innerHTML = player.name


		playerElement.setAttribute("number", index);

		if (playerId === this.#clientStore.myId) {
			playerElement.classList.add("me");
		}

		playerInner.appendChild(playerBody);
		playerInner.appendChild(playerName);
		playerElement.appendChild(playerInner);

		return playerElement;
	}

	removePlayerElement(playerId) {
		const element = document.getElementById(playerId);
		if (!element) return;
		element.remove();
	}
}
