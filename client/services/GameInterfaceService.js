import clientStore from '../stores/clientStore.js';

export default class GameInterfaceService {
	#gameInterface
	#clientStore

	constructor({gameInterface, clientStore}) {
		this.#gameInterface = gameInterface;
		this.#clientStore = clientStore;
	}

	createGameUI(gameId, players) {
		const exisitingUI = document.getElementById("game-ui");
		if (exisitingUI) return;

		const gameUI = document.createElement("div");
		gameUI.id= "game-ui" ;
		gameUI.className = 'ui'

		const game = document.getElementById("game");

		const idElement = this.createGameIdElement(gameId);
		const playerCountElement = this.createPlayerCountElement(players);
		const fullscreenButton = this.createFullscreenButton();

		game.appendChild(gameUI);
		gameUI.appendChild(idElement);
		gameUI.appendChild(playerCountElement);
		gameUI.appendChild(fullscreenButton);
	}

	createGameIdElement(gameId) {
		const gameIdElement = document.createElement("div");
		gameIdElement.id = "game-id";
		gameIdElement.className = "ui-item";

		const label = document.createElement("span");
		label.textContent = "Game ID: ";

		const button = document.createElement("button");
		button.id = "game-id-value";
		button.className = "value";
		button.type = "button";
		button.title = "Click to copy";
		button.textContent = gameId;

		button.addEventListener("dblclick", () => {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(gameId)
					.then(() => {
						button.textContent = "Copied!";
						setTimeout(() => { button.textContent = gameId; }, 1000);
					})
					.catch(() => alert("Failed to copy!"));
			} else {
				alert("Clipboard not supported");
			}
		});

		gameIdElement.append(label, button);
		return gameIdElement;
	}

	createFullscreenButton() {
		const fullscreenButton = document.createElement("button");
		fullscreenButton.id = "fullscreen-button";
		fullscreenButton.innerHTML = `<i class="fa-solid fa-expand"></i>`

		const page = document.documentElement;

		fullscreenButton.addEventListener("click", async () => {

			try {
				const isFullscreen = this.#clientStore.get("isFullscreen");

				if (isFullscreen) {
					await document.exitFullscreen();
				} else {
					await page.requestFullscreen();
				}

				this.#clientStore.update({isFullscreen: !isFullscreen});
			} catch (e) {
				console.error(e);
			}
		})

		document.addEventListener("fullscreenchange", () => {
			const isFullscreen = !!document.fullscreenElement;
			this.#clientStore.update({isFullscreen});

			if (isFullscreen) {
				fullscreenButton.innerHTML = `<i class="fa-solid fa-compress"></i>`
			} else {
				fullscreenButton.innerHTML = `<i class="fa-solid fa-expand"></i>`
			}
		})

		return fullscreenButton;
	}

	createPlayerCountElement(players) {

		const playerCount = Object.keys(players).length;

		const playerCountElement = document.createElement("div")
		playerCountElement.id = "player-count"
		playerCountElement.className = "ui-item";
		playerCountElement.innerHTML = `Players: <span id="player-count-value" class="value">${playerCount}</span>`;
		// playerCountElement.textContent = `Players: ${playerCount}`;

		return playerCountElement;
	}

	updateGameUI(gameId, playersCount) {
		const gameUI = document.getElementById("game-ui");
		if (!gameUI) return;

		// this.updateGameIdElement(gameId);
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
		if (!playerCountElement || playerCountValueElement) return;

		playerCountValueElement.textContent = playerCount;
	}

	getNumberOfPlayers(players) {
		const count = Object.keys(players).length;
		this.#gameInterface.playerCount = count;
		return count;
	}
}