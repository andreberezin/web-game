import {existingUI} from '../utils/existingUI.js';

export default class PlayerInterfaceService {
	#socketHandler;
	#clientStore
	#audioService
	#uiParts = ["id", "hp", "lives", "respawnTimer", "pause", "quit"]

	constructor({clientStore, audioService}) {
		this.#clientStore = clientStore;
		this.#audioService = audioService;
	}

	setSocketHandler(socketHandler) {
		this.#socketHandler = socketHandler;
	}

	createPlayerUI() {
		if (existingUI('player-ui')) return;

		const playerUI = document.createElement("div");
		playerUI.id = "player-ui";
		playerUI.className = 'ui'

		const playerUIleft = document.createElement("div");
		playerUIleft.id = "player-ui-left";
		playerUIleft.className = 'ui-part'

		const playerUImid = document.createElement("div");
		playerUImid.id = "player-ui-mid";
		playerUImid.className = 'ui-part'

		const playerUIright = document.createElement("div");
		playerUIright.id = "player-ui-right";
		playerUIright.className = 'ui-part'

		const game = document.getElementById("game");

		this.#uiParts.forEach(uiPart => {


			const element = uiPart === "respawnTimer" ? this.createRespawnTimer(uiPart) : (uiPart === "pause" || uiPart === "quit" ? this.createMenuButton(uiPart) : this.createElement(uiPart));

			switch (uiPart) {
			case "respawnTimer":
				const gameInner = document.getElementById("game-inner");
				gameInner.appendChild(element);
				break;
			case "hp":
				playerUIleft.appendChild(element);
				break;
			case "lives":
				playerUIleft.appendChild(element);
				break;
			case "pause":
				playerUImid.appendChild(element);
				break;
			case "quit":
				playerUImid.appendChild(element);
				break;
			default:
				playerUIright.appendChild(element);
			}
		})

		game.appendChild(playerUI);
		playerUI.appendChild(playerUIleft);
		playerUI.appendChild(playerUImid);
		playerUI.appendChild(playerUIright);
	}

	updatePlayerUI(player) {
		const playerUI = document.getElementById("player-ui");

		if (!playerUI) return;

		this.#uiParts.forEach(key => {
			if (player[key] !== undefined) {
				this.updateElement(key, player);
			}
		})
	}

	createElement(type) {

		const element = document.createElement("div");
		element.id = `player-${type}`;
		element.className = 'ui-item';
		element.innerHTML = `${type.toUpperCase()}: <span id="player-${type}-value" class='value'></span>`;

		return element;
	}

	updateElement(key, player) {

		const value = player[key]
		const element = document.getElementById(`player-${key}`);
		const elementValue = document.getElementById(`player-${key}-value`);
		if (!element || !elementValue) return;

		if (key === "respawnTimer") {
			if (player.lives === 0) {
				elementValue.textContent = "You are dead!"
				return;
			}
			player.status.alive ? element.style.display = "none" : element.style.display = "flex";
			elementValue.textContent = (value / 1000).toFixed(2);
		} else {
			elementValue.textContent = value
		}
	}


	createRespawnTimer(type) {
		const element = document.createElement("div");
		element.id = `player-${type}`;
		element.className = 'ui-item';
		element.innerHTML = `<span id="player-${type}-value" class='value'></span>`;
		element.style.display = "flex";

		return element;
	}

	hideRespawnTimer() {
		const element = document.getElementById("player-respawnTimer");
		element.style.display = "none";
	}

	createMenuButton(type) {
		const button = document.createElement('button');
		button.id = type;

		const store = this.#clientStore

		const myId = store.myId;

		const pauseCount = store.games.get(store.gameId).state.players[store.myId].pauses;

		if (type === "pause") {
			button.textContent = `PAUSE(${pauseCount})`;

			const emit = () => {
				this.#audioService.playClick();
				if (store.games.get(store.gameId).state.status === "started") {
					this.#socketHandler.socket.emit('gameStatusChange', store.gameId, "paused", myId)
				}
			}

			button.addEventListener('click', emit)
		} else if (type === "quit") {
			// button.innerHTML = `<i class="fas fa-stop"></i>`;
			button.textContent = `QUIT`;
			button.classList.add('enabled');

			button.addEventListener('click', () => {
				this.#audioService.playClick();
				this.#socketHandler.socket.emit('leaveGame', store.gameId, myId);
			})

		}
		return button;
	}

	updatePauseCounter(pauseCount) {
		const button = document.getElementById('pause');
		button.textContent = `PAUSE(${pauseCount})`;
	}

	disablePauseButton() {
		const button = document.getElementById('pause');
		if (!button) return;

		button.disabled = true;        // built-in way to disable clicks
		button.classList.remove('enabled'); // optional, for styling
	}

	enablePauseButton() {
		const button = document.getElementById('pause');
		if (!button) return;

		button.disabled = false;
		button.classList.add('enabled');
	}
}