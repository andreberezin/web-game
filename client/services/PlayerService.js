export default class PlayerService {
	#socketHandler;
	#clientStore
	#playerInputService;
	#keydownHandler = null;
	#keyupHandler = null;
	#mouseClickHandler = null;
	#mouseMoveHandler = null;
	#hasListeners = false;
	#gameFieldElement = null;
	#mousePosition = {x: 0, y: 0};

	constructor({clientStore, playerInputService}) {
		this.#clientStore = clientStore;
		this.#playerInputService = playerInputService;
		// this.initializeMouseTracking();
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
	//
	// addEventListeners(playerId) {
	// 	if (this.#hasListeners) return;
	// 	this.#hasListeners = true;
	//
	// 	//console.log("Adding event listeners");
	//
	// 	this.#keydownHandler = (event) => this.handleKeyPress(event, playerId);
	// 	this.#keyupHandler = (event) => this.handleKeyPress(event, playerId);
	// 	this.#mouseClickHandler = (event) => this.handleMouseClicking(event, playerId);
	// 	this.#mouseMoveHandler = (event) => this.handleMouseMove(event);
	//
	// 	window.addEventListener("keydown", this.#keydownHandler);
	// 	window.addEventListener("keyup", this.#keyupHandler);
	// 	const gameInner = document.getElementById("game-inner");
	// 	if (gameInner) {
	// 		gameInner.addEventListener("click", this.#mouseClickHandler);
	// 		gameInner.addEventListener("mousemove", this.#mouseMoveHandler);
	// 	}
	// }
	//
	// initializeMouseTracking() {
	// 	document.addEventListener('mouseenter', (event) => {
	// 		if(event.target.id === 'game-inner') {
	// 			this.#gameFieldElement = document.getElementById('game-inner');
	// 		}
	// 	});
	//
	// 	document.addEventListener('mouseleave', (event) => {
	// 		if(event.target.id === 'game-inner') {
	// 			this.#gameFieldElement = null;
	// 		}
	// 	});
	// }
	//
	// handleMouseMove(event) {
	// 	//if (this.#gameFieldElement !== document.getElementById('game-inner')) return;
	//
	// 	this.convertMousePositionWith(event);
	// 	this.rotateCurrentPlayer(event);
	// }
	//
	// rotateCurrentPlayer(event) {
	// 	const store = this.#clientStore;
	// 	const myId = store.myId;
	//
	// 	if (!myId || !store.gameId) return;
	//
	// 	const currentGame = store.games.get(store.gameId);
	// 	if (!currentGame) return;
	//
	// 	const myPlayer = currentGame.state.players[myId];
	// 	if (!myPlayer || !myPlayer.element || !myPlayer.pos || !myPlayer.size) return;
	//
	// 	const gameInner = document.getElementById('game-inner');
	// 	if (!gameInner) return;
	//
	// 	const rect = gameInner.getBoundingClientRect();
	// 	const scale = getComputedStyle(document.documentElement).getPropertyValue('--scale') || 1;
	// 	const mouseX = (event.clientX - rect.left) / parseFloat(scale);
	// 	const mouseY = (event.clientY - rect.top) / parseFloat(scale);
	// 	const playerCenterX = myPlayer.pos.x + (myPlayer.size.width / 2);
	// 	const playerCenterY = myPlayer.pos.y + (myPlayer.size.height / 2);
	// 	const deltaX = mouseX - playerCenterX;
	// 	const deltaY = mouseY - playerCenterY;
	// 	const angle = Math.atan2(deltaY, deltaX);
	//
	// 	// myPlayer.element.style.transform = `rotate(${angle}rad)`;
	//
	// 	const innerElement = myPlayer.element.querySelector('.player-inner');
	// 	if (innerElement) {
	// 		const bodyElement = innerElement.querySelector('.player-body');
	// 		if (bodyElement) {
	// 			bodyElement.style.transform = `rotate(${angle}rad)`;
	// 		}
	// 	}
	// }
	//
	// convertMousePositionWith(event) {
	// 	const gameInner = document.getElementById('game-inner');
	// 	if (!gameInner) return;
	// 	const rect = gameInner.getBoundingClientRect();
	// 	const scale = getComputedStyle(document.documentElement).getPropertyValue('--scale') || 1;
	//
	// 	this.#mousePosition.x = (event.clientX - rect.left) / parseFloat(scale);
	// 	this.#mousePosition.y = (event.clientY - rect.top) / parseFloat(scale);
	// }
	//
	// calculateShootingAngle(playerPos, playerSize) {
	// 	const playerCenterX = playerPos.x + (playerSize.width / 2);
	// 	const playerCenterY = playerPos.y + (playerSize.height / 2);
	//
	// 	const deltaX = this.#mousePosition.x - playerCenterX;
	// 	const deltaY = this.#mousePosition.y - playerCenterY;
	//
	// 	return Math.atan2(deltaY, deltaX);
	// }
	//
	// handleMouseClick(event, player) {
	// 	event.preventDefault()
	// 	this.convertMousePositionWith(event);
	//
	// 	if(player.pos && player.size) {
	// 		player.shootingAngle = this.calculateShootingAngle(player.pos, player.size);
	// 		player.input.space = true;
	//
	// 		setTimeout(() => {
	// 			player.input.space = false;
	// 		}, 50);
	// 	}
	// }
	//
	// handleMouseClicking(event, playerId) {
	// 	const store = this.#clientStore;
	// 	const player = store.games.get(store.gameId).state.players[playerId];
	//
	// 	this.handleMouseClick(event, player);
	//
	// 	const gameInner = document.getElementById('game-inner');
	// 	if (!gameInner) return;
	//
	// 	const rect = gameInner.getBoundingClientRect();
	// 	const scale = getComputedStyle(document.documentElement).getPropertyValue('--scale') || 1;
	// 	const mouseX = (event.clientX - rect.left) / parseFloat(scale);
	// 	const mouseY = (event.clientY - rect.top) / parseFloat(scale);
	// 	const playerCenterX = player.pos.x + (player.size.width / 2);
	// 	const playerCenterY = player.pos.y + (player.size.height / 2);
	// 	const deltaX = mouseX - playerCenterX;
	// 	const deltaY = mouseY - playerCenterY;
	// 	const angle = Math.atan2(deltaY, deltaX);
	//
	// 	const socket = this.#socketHandler.socket;
	// 	socket.emit('updateMyPlayerInput', {
	// 		key: ' ',
	// 		type: 'mouseclick',
	// 		shootingAngle: angle,
	// 		mousePosition: { x: mouseX, y: mouseY }
	// 	});
	// }
	//
	// removeEventListeners() {
	// 	if (!this.#hasListeners) return;
	// 	window.removeEventListener("keydown", this.#keydownHandler);
	// 	window.removeEventListener("keyup", this.#keyupHandler);
	// 	const gameInner = document.getElementById("game-inner");
	// 	if (gameInner && this.#mouseClickHandler) {
	// 		gameInner.removeEventListener("click", this.#mouseClickHandler);
	// 	}
	// 	this.#hasListeners = false;
	// 	this.#keydownHandler = null;
	// 	this.#keyupHandler = null;
	// 	this.#mouseClickHandler = null;
	// }
	//
	// handleKeyPress(event, playerId) {
	// 	//if (event.type === 'keydown' && event.repeat) return;
	// 	//if (event.repeat) return;
	// 	const currentGame = this.#clientStore.games.get(this.#clientStore.gameId);
	//
	// 	if (currentGame.state.status === "started") {
	// 		const player = currentGame.state.players[playerId];
	// 		const socket = this.#socketHandler.socket
	// 		player.shootingAngle = this.calculateShootingAngle(player.pos, player.size);
	//
	// 		socket.emit('updateMyPlayerInput', {
	// 			// playerId: playerId,
	// 			key: event.key,
	// 			type: event.type,
	// 			shootingAngle: player.shootingAngle
	// 		})
	// 	}
	// }

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

	// removePlayerModels() {
	// 	const store = this.#clientStore;
	// 	const {players} = store.games.get(store.gameId).state;
	//
	// 	for (const playerID in players) {
	// 		delete players[playerID];
	//
	// 		const element = document.getElementById(playerID);
	// 		console.log("removed player: ",  playerID);
	//
	// 		if (element) {
	// 			element.remove();
	// 		}
	// 	}
	//
	// 	// cleanup for any other player elements just in case
	// 	const elements = document.getElementsByClassName("player")
	//
	// 	if (elements.length > 0) {
	// 		[...elements].forEach((element) => {element.remove()});
	// 	}
	// }
}
