export class PlayerInterfaceService {
	#clientManager

	constructor(playerInterface) {

	}

	createPlayerUI() {
		const exisitingUI = document.getElementById("player-ui");
		if (exisitingUI) return;

		const playerUI = document.createElement("div");
		playerUI.id= "player-ui" ;

		const root = document.getElementById("root");

		const idElement = this.createPlayerIdElement();

		root.appendChild(playerUI);
		playerUI.appendChild(idElement);
	}

	updatePlayerUI(playerId) {
		const playerUI = document.getElementById("player-ui");
		if (!playerUI) return;

		this.updatePlayerIdElement(playerId);
	}

	createPlayerIdElement() {
		const playerIdElement = document.createElement("div")
		playerIdElement.id = "player-id"
		playerIdElement.className = "ui-item";
		playerIdElement.innerHTML = `Player id: <span id="player-id-value" class="value"></span>`;

		//this.#gameInterface.setIdElement(gameIdElement);

		return playerIdElement;
	}

	updatePlayerIdElement(playerId) {
		const playerIdElement = document.getElementById("player-id");
		const playerIdValueElement = document.getElementById("player-id-value");
		if (!playerIdElement || !playerIdValueElement) return;

		playerIdValueElement.textContent = playerId
	}

}