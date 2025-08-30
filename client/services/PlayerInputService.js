export default class PlayerInputService {
	#clientStore;
	#audioService;
	#socketHandler
	#keydownHandler = null;
	#keyupHandler = null;
	#mouseClickHandler = null;
	#mouseMoveHandler = null;
	#hasListeners = false;
	#gameFieldElement = null;
	#mousePosition = {x: 0, y: 0};

	constructor({clientStore, audioService}) {
		this.#clientStore = clientStore;
		this.#audioService = audioService;
		this.initializeMouseTracking();
	}

	setSocketHandler(handler) {
		this.#socketHandler = handler;
	}

	addEventListeners(playerId) {
		if (this.#hasListeners) return;
		this.#hasListeners = true;

		//console.log("Adding event listeners");

		this.#keydownHandler = (event) => this.handleKeyPress(event, playerId);
		this.#keyupHandler = (event) => this.handleKeyPress(event, playerId);
		this.#mouseClickHandler = (event) => this.handleMouseClicking(event, playerId);
		this.#mouseMoveHandler = (event) => this.handleMouseMove(event);

		window.addEventListener("keydown", this.#keydownHandler);
		window.addEventListener("keyup", this.#keyupHandler);
		const gameInner = document.getElementById("game-inner");
		if (gameInner) {
			gameInner.addEventListener("click", this.#mouseClickHandler);
			gameInner.addEventListener("mousemove", this.#mouseMoveHandler);
		}
	}

	initializeMouseTracking() {
		document.addEventListener('mouseenter', (event) => {
			if(event.target.id === 'game-inner') {
				this.#gameFieldElement = document.getElementById('game-inner');
			}
		});

		document.addEventListener('mouseleave', (event) => {
			if(event.target.id === 'game-inner') {
				this.#gameFieldElement = null;
			}
		});
	}

	handleMouseMove(event) {
		//if (this.#gameFieldElement !== document.getElementById('game-inner')) return;

		this.convertMousePositionWith(event);
		this.rotateCurrentPlayer(event);
	}

	rotateCurrentPlayer(event) {
		const store = this.#clientStore;
		const myId = store.myId;

		if (!myId || !store.gameId) return;

		const currentGame = store.games.get(store.gameId);
		if (!currentGame) return;

		const myPlayer = currentGame.state.players[myId];
		if (!myPlayer || !myPlayer.element || !myPlayer.pos || !myPlayer.size) return;

		const gameInner = document.getElementById('game-inner');
		if (!gameInner) return;

		const rect = gameInner.getBoundingClientRect();
		const scale = getComputedStyle(document.documentElement).getPropertyValue('--scale') || 1;
		const mouseX = (event.clientX - rect.left) / parseFloat(scale);
		const mouseY = (event.clientY - rect.top) / parseFloat(scale);
		const playerCenterX = myPlayer.pos.x + (myPlayer.size.width / 2);
		const playerCenterY = myPlayer.pos.y + (myPlayer.size.height / 2);
		const deltaX = mouseX - playerCenterX;
		const deltaY = mouseY - playerCenterY;
		const angle = Math.atan2(deltaY, deltaX);

		// myPlayer.element.style.transform = `rotate(${angle}rad)`;

		const innerElement = myPlayer.element.querySelector('.player-inner');
		if (innerElement) {
			const bodyElement = innerElement.querySelector('.player-body');
			if (bodyElement) {
				bodyElement.style.transform = `rotate(${angle}rad)`;
			}
		}
	}

	convertMousePositionWith(event) {
		const gameInner = document.getElementById('game-inner');
		if (!gameInner) return;
		const rect = gameInner.getBoundingClientRect();
		const scale = getComputedStyle(document.documentElement).getPropertyValue('--scale') || 1;

		this.#mousePosition.x = (event.clientX - rect.left) / parseFloat(scale);
		this.#mousePosition.y = (event.clientY - rect.top) / parseFloat(scale);
	}

	calculateShootingAngle(playerPos, playerSize) {
		const playerCenterX = playerPos.x + (playerSize.width / 2);
		const playerCenterY = playerPos.y + (playerSize.height / 2);

		const deltaX = this.#mousePosition.x - playerCenterX;
		const deltaY = this.#mousePosition.y - playerCenterY;

		return Math.atan2(deltaY, deltaX);
	}

	handleMouseClick(event, player) {
		event.preventDefault()
		this.convertMousePositionWith(event);

		if(player.pos && player.size) {
			player.shootingAngle = this.calculateShootingAngle(player.pos, player.size);
			player.input.space = true;
			this.#audioService.playShoot();

			setTimeout(() => {
				player.input.space = false;
			}, 50);
		}
	}

	handleMouseClicking(event, playerId) {
		const store = this.#clientStore;
		const player = store.games.get(store.gameId).state.players[playerId];

		this.handleMouseClick(event, player);

		const gameInner = document.getElementById('game-inner');
		if (!gameInner) return;

		const rect = gameInner.getBoundingClientRect();
		const scale = getComputedStyle(document.documentElement).getPropertyValue('--scale') || 1;
		const mouseX = (event.clientX - rect.left) / parseFloat(scale);
		const mouseY = (event.clientY - rect.top) / parseFloat(scale);
		const playerCenterX = player.pos.x + (player.size.width / 2);
		const playerCenterY = player.pos.y + (player.size.height / 2);
		const deltaX = mouseX - playerCenterX;
		const deltaY = mouseY - playerCenterY;
		const angle = Math.atan2(deltaY, deltaX);

		const socket = this.#socketHandler.socket;
		socket.emit('updateMyPlayerInput', {
			key: ' ',
			type: 'mouseclick',
			shootingAngle: angle,
			mousePosition: { x: mouseX, y: mouseY }
		});
	}

	removeEventListeners() {
		if (!this.#hasListeners) return;
		window.removeEventListener("keydown", this.#keydownHandler);
		window.removeEventListener("keyup", this.#keyupHandler);
		const gameInner = document.getElementById("game-inner");
		if (gameInner && this.#mouseClickHandler) {
			gameInner.removeEventListener("click", this.#mouseClickHandler);
		}
		this.#hasListeners = false;
		this.#keydownHandler = null;
		this.#keyupHandler = null;
		this.#mouseClickHandler = null;
	}

	handleKeyPress(event, playerId) {
		//if (event.type === 'keydown' && event.repeat) return;
		//if (event.repeat) return;
		const currentGame = this.#clientStore.games.get(this.#clientStore.gameId);

		if (currentGame.state.status === "started") {
			const player = currentGame.state.players[playerId];
			const socket = this.#socketHandler.socket
			player.shootingAngle = this.calculateShootingAngle(player.pos, player.size);

			socket.emit('updateMyPlayerInput', {
				// playerId: playerId,
				key: event.key,
				type: event.type,
				shootingAngle: player.shootingAngle
			})
		}
	}
}
