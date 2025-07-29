export default class PlayerInterfaceService {
	// #uiParts = ["id", "hp", "deathCooldown"]
	#uiParts = ["id", "hp"]

	constructor() {
	}

	createPlayerUI() {
		const exisitingUI = document.getElementById("player-ui");
		if (exisitingUI) return;

		const playerUI = document.createElement("div");
		playerUI.id= "player-ui" ;
		playerUI.className = 'ui'

		const game = document.getElementById("game");

		game.appendChild(playerUI);

		this.#uiParts.forEach(uiPart => {
			if (uiPart === "deathCooldown") return;

			const element = this.createElement(uiPart);
			playerUI.appendChild(element);

			// if (uiPart === "deathCooldown") {
			// 	const gameInner = document.getElementById('game-inner');
			// 	element.hidden = true;
			// 	gameInner.appendChild(element);
			// 	return
			// }

		})
	}

	updatePlayerUI(player) {
		const playerUI = document.getElementById("player-ui");
		if (!playerUI) return;

		this.#uiParts.forEach(key => {
			if(player[key] !== undefined) {

				// if (key === "deathCooldown") {
				// 	this.handleDeathCooldownElement(player, key);
				// 	return;
				// }

				this.updateElement(key, player[key]);
			}
		})
	}

	createElement(type) {
		const element = document.createElement("div");
		element.id= `player-${type}`;
		element.className = 'ui-item';
		element.innerHTML = `${type.toUpperCase()}: <span id="player-${type}-value" class='value'></span>`;

		return element;
	}

	updateElement(key, value) {
		const element = document.getElementById(`player-${key}`);
		const elementValue = document.getElementById(`player-${key}-value`);
		if (!element || !elementValue) return;

		elementValue.textContent = value
	}

	removeElement(key) {
		const element = document.getElementById(`player-${key}`);
		if (element) element.remove();
	}

	// handleDeathCooldownElement(player, key) {
	// 	if (!player.status.alive) {
	// 		console.log("Handling death cooldown element");
	// 		const gameInner = document.getElementById('game-inner')
	// 		const element = document.createElement("div");
	// 		element.id= `player-${key}`;
	// 		element.innerHTML = `${player.respawnTimer} <span id="player-${key}-value" class='value'></span>`;
	// 		gameInner.appendChild(element);
	//
	// 	} else {
	// 		this.removeElement(key)
	// 	}
	// }
}