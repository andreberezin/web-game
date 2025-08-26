import {existingUI} from '../utils/existingUI.js';

export default class PlayerInterfaceService {
	#socketHandler;
	#clientStore
	#uiParts = ["id", "hp", "lives", "respawnTimer", "pause", "quit"]

	constructor({clientStore}) {
		this.#clientStore = clientStore;
	}

	setSocketHandler(socketHandler) {
		this.#socketHandler = socketHandler;
	}

	createPlayerUI() {
		if (existingUI('player-ui')) return;

		const playerUI = document.createElement("div");
		playerUI.id= "player-ui" ;
		playerUI.className = 'ui'

		const playerUIleft = document.createElement("div");
		playerUIleft.id= "player-ui-left" ;
		playerUIleft.className = 'ui-part'

		const playerUImid = document.createElement("div");
		playerUImid.id= "player-ui-mid" ;
		playerUImid.className = 'ui-part'

		const playerUIright = document.createElement("div");
		playerUIright.id= "player-ui-right" ;
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
			if(player[key] !== undefined) {
				this.updateElement(key, player);
			}
		})
	}

	createElement(type) {

		const element = document.createElement("div");
		element.id= `player-${type}`;
		element.className = 'ui-item';
		element.innerHTML = `${type.toUpperCase()}: <span id="player-${type}-value" class='value'></span>`;

		if (type === "deathCooldown") {
			element.hidden = true;
		}

		return element;
	}

	updateElement(key, player) {

		const value = player[key]
		const element = document.getElementById(`player-${key}`);
		const elementValue = document.getElementById(`player-${key}-value`);
		if (!element || !elementValue) return;

		if (key === "respawnTimer") {
			element.hidden = player.status.alive;
			elementValue.textContent = (value / 1000).toFixed(2);
		} else {
			elementValue.textContent = value
		}
	}

	createRespawnTimer(type) {
		const element = document.createElement("div");
		element.id= `player-${type}`;
		element.className = 'ui-item';
		element.innerHTML = `<span id="player-${type}-value" class='value'></span>`;
		element.hidden = true;

		return element;
	}

	createMenuButton(type) {
		const button = document.createElement('button');
		button.id = type;

		if (type === "pause") {
			// button.innerHTML = `<i class="fas fa-pause"></i>`;
			button.textContent = `PAUSE`;

			button.addEventListener('click', () => {
				this.#socketHandler.socket.emit('gameStatusChange', this.#clientStore.gameId, "paused")
			})
			// pause game
		} else if (type === "quit") {
			// button.innerHTML = `<i class="fas fa-stop"></i>`;
			button.textContent = `QUIT`;
			// quite game
		}


		return button;
	}
}