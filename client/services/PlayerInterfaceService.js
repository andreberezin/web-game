export default class PlayerInterfaceService {
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
			const element = this.createElement(uiPart);
			playerUI.appendChild(element);
		})
	}

	updatePlayerUI(player) {
		const playerUI = document.getElementById("player-ui");
		if (!playerUI) return;

		this.#uiParts.forEach(key => {
			if(player[key] !== undefined) {
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
}