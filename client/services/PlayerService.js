export default class PlayerService {
	#clientManager;

	constructor({playerInputService}) {
		this.playerInputService = playerInputService;
	}

	setClientManager(clientManager) {
		this.#clientManager = clientManager;
	}

	updatePlayerModel(timestamp, newPlayerData, playerId) {
		let player = this.#clientManager.game.state.players[playerId];
		const {arrowDown, arrowUp, arrowRight, arrowLeft} = player.input;

		if (!player.element) {
			return;
		}

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

		// todo users setters and getters
		if (this.playerIsNotMoving(player)) {
			this.resetAcceleration(player, timestamp);
		}

		// this.setMaxPosition(player);

		// todo users setters and getters
		const elapsed = timestamp - player.start;
		player.shift = Math.min(0.001 * elapsed, 10);

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

	// todo should be part of Player.js
	// setMaxPosition(player) {
	//
	// 	const gameInner = document.getElementById('game-inner')
	// 	const rect = gameInner.getBoundingClientRect();
	//
	// 	const playerElement = document.getElementsByClassName("player")[0];
	//
	// 	player.maxPosition = ({
	// 		x: rect.width - playerElement.offsetWidth,
	// 		y: rect.height - playerElement.offsetHeight,
	// 	})
	// 	// player.getMaxPosition.x = player.getMaxPosition.x - playerElement.offsetWidth;
	// 	// player.getMaxPosition.y = player.getMaxPosition.x - playerElement.offsetWidth;
	// }

	updateElementPosition(player) {
		player.element.style.top = `${player.position.y}px`
		player.element.style.left = `${player.position.x}px`
	}

	createPlayerModel(playerData, playerId) {
		if (document.getElementById(playerId) !== null) {
			console.log("Player already exists!");
			return;
		}

		const player = this.#clientManager.game.state.players[playerId];
		player.position = playerData.pos;

        const numberOfPlayers = Object.keys(this.#clientManager.game.state.players).length;

 		const playerElement = this.createElement(player, numberOfPlayers, playerId);
		this.addEventListeners(playerElement, player);
		player.element = playerElement;

		// console.log("players", this.#clientManager.game.state.players);
		this.appendToGameField(playerElement, playerId);
	}

	appendToGameField(playerElement, playerId) {
		const gameField = document.getElementById("game-inner");
		gameField.appendChild(playerElement);
		if (playerId === this.#clientManager.myID) {
			playerElement.focus();
		}
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
		playerElement.style.top = `${player.position.y}px`
		playerElement.style.left = `${player.position.x}px`
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

		// for (const property in player.styles) {
		// 	playerElement.style[property] = player.styles[property]
		// }

		return playerElement;
	}

	removePlayerModel(playerId) {
		const playerElement = document.getElementById(playerId);
		playerElement.remove();
	}

}
