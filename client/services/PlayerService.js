
export class PlayerService {
	#clientManager;

	constructor(playerInputService) {
		this.playerInputService = playerInputService;
	}

	setClientManager(clientManager) {
		this.#clientManager = clientManager;
	}

	updatePlayerModel(timestamp, newPlayerData, playerId) {
		let player = this.#clientManager.game.state.players[playerId];
		const {arrowDown, arrowUp, arrowRight, arrowLeft} = player.input;

		if (!player.getElement) {
			return;
		}

		// todo users setters and getters
		if (this.playerIsNotMoving(player)) {
			this.resetAcceleration(player, timestamp);
		}

		this.setMaxPosition(player);

		// todo users setters and getters
		const elapsed = timestamp - player.start;
		const newShiftValue = Math.min(0.001 * elapsed, 10);
		player.setShift(newShiftValue);

		// todo users setters and getters
		if (this.noInputFound(arrowDown, arrowUp, arrowRight, arrowLeft)) {
			player.start = undefined;
		}

		this.updateElementPosition(player);
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

	setMaxPosition(player) {
		player.getMaxPosition.y = 500;
		player.getMaxPosition.x = 500;
	}

	updateElementPosition(player) {
		player.getElement.style.top = `${player.getPosition.y}px`
		player.getElement.style.left = `${player.getPosition.x}px`
	}

	createPlayerModel(playerData, playerId) {
		if (document.getElementById(playerId) !== null) {
			console.log("Player already exists!");
			return;
		}

		const player = this.#clientManager.game.state.players[playerId];
		this.setPosition(player, playerData);

        const numberOfPlayers = Object.keys(this.#clientManager.game.state.players).length;

 		const playerElement = this.createElement(player, numberOfPlayers, playerId);
		this.addEventListeners(playerElement, player);
		player.setElement(playerElement);

		console.log("players", this.#clientManager.game.state.players);
		this.appendToGameField(playerElement, playerId);
	}

	appendToGameField(playerElement, playerId) {
		const gameField = document.getElementById("game-field");
		gameField.appendChild(playerElement);
		if (playerId === this.#clientManager.myID) {
			playerElement.focus();
		}
	}

	setPosition(player, playerData) {
		player.getPosition.x = playerData.pos.x;
		player.getPosition.y = playerData.pos.y;
	}

	addEventListeners(playerElement, player) {
		playerElement.addEventListener("keydown", (event) => {
			this.playerInputService.handleKeyDown(event, player);
		})

		playerElement.addEventListener("keyup", (event) => {
			this.playerInputService.handleKeyUp(event, player);
		})
	}

	createElement(player, numberOfPlayers, playerId) {
		const playerElement = document.createElement("div")
		playerElement.classList.add("player")
		playerElement.id = `${playerId}`
		playerElement.style.top = `${player.getPosition.y}px`
		playerElement.style.left = `${player.getPosition.x}px`
		playerElement.tabIndex = 0;

		// css variable for styling
		playerElement.style.setProperty("--name", `"${playerId.substring(0, 5)}"`)
		playerElement.setAttribute("number", numberOfPlayers);

		// Set a real HTML attribute (for DOM querying)
		//playerElement.setAttribute("data-player-id", playerId);

		//player.textContent = playerData.name;

		if (playerId === this.#clientManager.myID) {
			playerElement.classList.add("me")
		}

		for (const property in player.styles) {
			playerElement.style[property] = player.styles[property]
		}

		return playerElement;
	}

	// TODO: implement removePlayerModel()
	removePlayerModel() {}

}
