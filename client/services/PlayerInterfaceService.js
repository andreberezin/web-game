export default class PlayerInterfaceService {
	#uiParts = ["id", "hp", "respawnTimer"]

	constructor() {
	}

	createPlayerUI(playerID) {
		const exisitingUI = document.getElementById("player-ui");
		if (exisitingUI) return;

		const playerUI = document.createElement("div");
		playerUI.id= "player-ui" ;
		playerUI.className = 'ui'

		const game = document.getElementById("game");

		game.appendChild(playerUI);

		this.#uiParts.forEach(uiPart => {
			if (uiPart === "respawnTimer") {
				const gameInner = document.getElementById("game-inner");
				const element = this.createRespawnTimer(uiPart);
				gameInner.appendChild(element);
			} else {
				const element = this.createElement(uiPart);
				playerUI.appendChild(element);
			}
		})
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

	removeElement(key) {
		const element = document.getElementById(`player-${key}`);
		if (element) element.remove();
	}

	createRespawnTimer(type) {
		const element = document.createElement("div");
		element.id= `player-${type}`;
		element.className = 'ui-item';
		element.innerHTML = `<span id="player-${type}-value" class='value'></span>`;
		element.hidden = true;

		return element;
	}

	handleDeathCooldownElement(player, key) {
		if (!player.status.alive) {
			console.log("Handling death cooldown element");
			const gameInner = document.getElementById('game-inner')
			const element = document.createElement("div");
			element.id= `player-${key}`;
			element.innerHTML = `${player.respawnTimer} <span id="player-${key}-value" class='value'></span>`;
			gameInner.appendChild(element);

		} else {
			this.removeElement(key)
		}
	}
}