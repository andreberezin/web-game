export default class GameInterfaceService {
	#gameInterface

	constructor({gameInterface}) {
		this.#gameInterface = gameInterface;
	}

	createGameUI() {
		const exisitingUI = document.getElementById("game-ui");
		if (exisitingUI) return;

		const gameUI = document.createElement("div");
		gameUI.id= "game-ui" ;

		const root = document.getElementById("root");

		const idElement = this.createGameIdElement();
		const playerCountElement = this.createPlayerCountElement();

		root.appendChild(gameUI);
		gameUI.appendChild(idElement);
		gameUI.appendChild(playerCountElement);
	}

	createGameIdElement() {
		const gameIdElement = document.createElement("div")
		gameIdElement.id = "game-id"
		gameIdElement.className = "ui-item";
		gameIdElement.innerHTML = `Game id: <span id="game-id-value" class="value"></span>`;

		return gameIdElement;
	}

	createPlayerCountElement() {
		const playerCountElement = document.createElement("div")
		playerCountElement.id = "player-count"
		playerCountElement.className = "ui-item";
		playerCountElement.innerHTML = `Players: <span id="player-count-value" class="value"></span>`;

		return playerCountElement;
	}

	updateGameUI(gameId, playersCount) {
		const gameUI = document.getElementById("game-ui");
		if (!gameUI) return;

		this.updateGameIdElement(gameId);
		this.updatePlayerCountElement(playersCount);

	}

	updateGameIdElement(gameId) {
		const gameIdElement = document.getElementById("game-id");
		const gameIdValueElement = document.getElementById("game-id-value");
		if (!gameIdElement || !gameIdValueElement) return;

		gameIdValueElement.textContent = gameId
	}

	updatePlayerCountElement(playerCount) {
		const playerCountElement = document.getElementById("player-count");
		const playerCountValueElement = document.getElementById("player-count-value");
		if (!playerCountElement || !playerCountValueElement) return;

		playerCountValueElement.textContent = playerCount;
	}

	getNumberOfPlayers(players) {
		const count = Object.keys(players).length;
		this.#gameInterface.setPlayerCount(count);
		return count;
	}
}