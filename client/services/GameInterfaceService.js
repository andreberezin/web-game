import {existingUI} from '../utils/existingUI.js';

export default class GameInterfaceService {
	#gameInterface
	#clientStore

	constructor({gameInterface, clientStore}) {
		this.#gameInterface = gameInterface;
		this.#clientStore = clientStore;
	}

	createGameUI(gameId, game, players) {
		if (existingUI("game-ui")) return;

		const gameUI = document.createElement("div");
		gameUI.id= "game-ui" ;
		gameUI.className = 'ui'

		const gameElement = document.getElementById("game");

		const idElement = this.createGameIdElement(gameId);
		const playerCountElement = this.createPlayerCountElement(players);

		const timeRemaining = this.#clientStore.games.get(gameId).state.timeRemaining;

		const countdownElement = this.createCountdownElement(timeRemaining);
		const fullscreenButton = this.createFullscreenButton();

		gameElement.appendChild(gameUI);
		gameUI.appendChild(idElement);
		gameUI.appendChild(countdownElement);
		gameUI.appendChild(playerCountElement);
		gameUI.appendChild(fullscreenButton);
	}

	createGameIdElement(gameId) {
		const gameIdElement = document.createElement("div");
		gameIdElement.id = "game-id";
		gameIdElement.className = "ui-item";

		// const label = document.createElement("span");
		// label.textContent = "Game ID: ";

		const button = document.createElement("button");
		button.id = "game-id-value";
		button.className = "value";
		button.type = "button";
		button.title = "Double click to copy";
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

		gameIdElement.append(button);
		return gameIdElement;
	}

	createFullscreenButton() {
		const fullscreenButton = document.createElement("button");
		fullscreenButton.id = "fullscreen-button";
		fullscreenButton.innerHTML = `<i class="fas fa-expand"></i>`

		const page = document.documentElement;

		// event listener straight on the button
		fullscreenButton.addEventListener("click", async () => {

			try {
				if (document.fullscreenElement !== null) {
					await document.exitFullscreen();
				} else {
					await page.requestFullscreen();
				}
			} catch (e) {
				console.error(e);
			}
		})

		window.addEventListener("fullscreenchange", () => {
			const isFullscreen = !!document.fullscreenElement;

			if (isFullscreen) {
				fullscreenButton.innerHTML = `<i class="fas fa-compress"></i>`
			} else {
				fullscreenButton.innerHTML = `<i class="fas fa-expand"></i>`
			}
		})

		return fullscreenButton;
	}

	createCountdownElement(timeRemaining) {
		const countdownElement = document.createElement("div");
		countdownElement.id = "countdown";
		countdownElement.className = "ui-item";
		const time = (timeRemaining / 1000).toFixed(2);
		countdownElement.textContent = time;

		return countdownElement;
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

	updateGameUI(game) {
		const gameUI = document.getElementById("game-ui");
		if (!gameUI) return;


		const playersCount = this.getNumberOfPlayers(game.state.players)
		this.updatePlayerCountElement(playersCount);
		this.updateCountdownElement(game.state.timeRemaining);
	}


	updatePlayerCountElement(playerCount) {

		const playerCountElement = document.getElementById("player-count");
		const playerCountValueElement = document.getElementById("player-count-value");
		if (!playerCountElement || !playerCountValueElement) return;

		playerCountValueElement.textContent = playerCount;
	}

	updateCountdownElement(timeRemaining) {
		const countdownElement = document.getElementById("countdown");
		if (!countdownElement) return;
		const time = (timeRemaining / 1000).toFixed(2);
		countdownElement.textContent = time;

		if (time <= 10 && countdownElement.style.color !== "red") {
			countdownElement.style.color = "red";
		}
	}

	getNumberOfPlayers(players) {
		const count = Object.keys(players).length;
		this.#gameInterface.playerCount = count;
		return count;
	}

	createLivesDisplay() {
		if (document.getElementById('lives-display')) return;

		const livesDisplay = document.createElement('div');
		livesDisplay.id = 'lives-display';
		livesDisplay.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 14px;
        z-index: 1000;
        min-width: 150px;
    `;

		document.body.appendChild(livesDisplay);
	}
}
