
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

		if (!player.getElement) {
			//console.error("Element not found, cannot update position for ", player.id);
			return;
		}

		// todo users setters and getters
		if (player.start === undefined) {
			player.start = timestamp;
		}

		//this.#maxPosition.y = window.innerHeight - this.#element.offsetHeight
		//this.#maxPosition.x = window.innerWidth - this.#element.offsetWidth

		player.getMaxPosition.y = 500;
		player.getMaxPosition.x = 500;

		// todo users setters and getters
		const elapsed = timestamp - player.start;
		const newShiftValue = Math.min(0.001 * elapsed, 10);
		player.setShift(newShiftValue);

		player.getPosition.y = newPlayerData.getPosition.y;
		player.getPosition.x = newPlayerData.getPosition.x;

		// todo users setters and getters
		if (player.input.arrowDown === false && player.input.arrowUp === false && player.input.arrowRight === false && player.input.arrowLeft === false) {
			player.start = undefined;
		}

		player.getElement.style.top = `${player.getPosition.y}px`
		player.getElement.style.left = `${player.getPosition.x}px`
	}



	createPlayerModel(playerData, playerId) {
		if (document.getElementById(playerId) !== null) {
			console.log("Player already exists!");
			return;
		}

		const player = this.#clientManager.game.state.players[playerId];

		const numberOfPlayers = Object.keys(this.#clientManager.game.state.players).length

		//console.log("players", this.#clientManager.game.state.players);

		player.getPosition.x = playerData.pos.x;
		player.getPosition.y = playerData.pos.y;

		console.log("Creating element for player: ", player.getId);

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

		playerElement.addEventListener("keydown", (event) => {
			this.playerInputService.handleKeyDown(event, player);
		})

		playerElement.addEventListener("keyup", (event) => {
			this.playerInputService.handleKeyUp(event, player);
		})

		player.setElement(playerElement);

		const gameField = document.getElementById("game-field");

		gameField.appendChild(playerElement);

		playerElement.focus();
	}


	removePlayerModel() {

	}

}
