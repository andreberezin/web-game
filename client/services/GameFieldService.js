import {existingUI} from '../utils/existingUI.js';

export default class GameFieldService {
	#clientStore
	#socketHandler

	// todo duplicate code. Maube have the tilemap layout in backend and when a game is created send the array to frontend depending on the player chosen map (currently either "empty" or "simple")
	#map = [
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	];

	#mapConfig = {
		TILE_SIZE: 40,
		TILES_X: 48,
		TILES_Y: 27,
	};

	constructor({clientStore}) {
		this.#clientStore = clientStore;
	}

	setSocketHandler(handler) {
		this.#socketHandler = handler;
	}

	createGameElement() {
		if (existingUI('game')) return;

		const root = document.getElementById('root');
		const game = document.createElement('div');
		game.id = 'game';

		root.append(game);
	}

	createGamefieldElement(mapType) {
		if (existingUI('game-field')) return;
		//console.log("Map type", mapType);


		const gameField = document.createElement('div');
		gameField.id = 'game-field';
		gameField.addEventListener('click', () => {
			if (document.getElementsByClassName("me").length > 0) {
				document.getElementsByClassName("me")[0].focus();
			}
		})

		const gameInner = document.createElement('div');
		gameInner.id = 'game-inner';

		const lobbyOverlay = this.createLobbyOverlay();
		const scoreboardOverlay = this.createScoreboardOverlay();
		const pauseOverlay = this.createPauseOverlay();
		const notification = this.createNotification();

		const game = document.getElementById('game');

		game.append(gameField);
		gameField.append(gameInner);
		gameField.append(lobbyOverlay);
		gameField.append(scoreboardOverlay);
		gameField.append(pauseOverlay);
		gameField.append(notification);

		this.generateWalls();
	}

	removeGameElements() {
		const game = document.getElementById('game');
		if (!game) {
			console.warn('Game element does not exist. Cannot remove.')
			return;
		}
		game.remove();
	}

	appendToGameField(element) {
		const gameField = document.getElementById("game-inner");
		if (!gameField) return;
		gameField.appendChild(element);
	}

	// pause overlay
	createPauseOverlay() {
		if (existingUI('paused')) return;

		const pauseOverlay = document.createElement('div');
		pauseOverlay.id = 'paused';
		pauseOverlay.classList.add('overlay');

		// const pausedBy = this.createPausedBy();
		const pauseTimer = this.createPauseTimer();
		const resume = this.createResumeButton();
		const restart = this.createRestartButton();

		const buttonsContainer = document.createElement('div');
		buttonsContainer.id = 'buttons-container';

		pauseOverlay.appendChild(pauseTimer);
		pauseOverlay.appendChild(buttonsContainer);
		// pauseOverlay.appendChild(pausedBy);
		buttonsContainer.appendChild(resume);
		buttonsContainer.appendChild(restart);

		return pauseOverlay;
	}

	createResumeButton() {
		const button = document.createElement('button');
		button.id = 'resume';
		button.textContent = 'Resume';
		button.addEventListener('click', () => {
			this.#socketHandler.socket.emit('gameStatusChange', this.#clientStore.gameId, "started", this.#clientStore.myId);
		})

		return button;
	}

	createRestartButton() {
		const button = document.createElement('button');
		button.id = 'restart';
		button.textContent = 'Restart';

		button.addEventListener('click', () => {
			this.#socketHandler.socket.emit('gameStatusChange', this.#clientStore.gameId, "waiting", this.#clientStore.myId);
		})

		return button;
	}

	createPausedBy() {
		const pausedBy = document.createElement('div');
		pausedBy.id = 'paused-by';
		pausedBy.textContent = 'Game paused by'

		return pausedBy;
	}

	createPauseTimer() {
		const pauseTimer = document.createElement('div');
		pauseTimer.id = 'paused-timer';

		return pauseTimer;
	}

	togglePauseOverlay() {
		console.log("toggling pause overlay");
		const pauseOverlay = document.getElementById('paused');
		pauseOverlay.style.display === 'none' ? pauseOverlay.style.display = 'flex' : pauseOverlay.style.display = 'none';
	}

	showPauseOverlay() {
		console.log("toggling pause overlay");
		const pauseOverlay = document.getElementById('paused');
		pauseOverlay.style.display = 'flex'
	}

	hidePauseOverlay() {
		const pauseOverlay = document.getElementById('paused');
		pauseOverlay.style.display = 'none'
	}

	updatePausedBy(gameId, playerId) {
		const playerName = this.#clientStore.games.get(gameId).state.players[playerId].name;
		console.log("Playername: " + playerName);
		const pausedBy = document.getElementById('paused-by');
		pausedBy.textContent = `Game paused by ${playerName}`;
	}

	updatePauseTimer(timeRemaining) {
		const pauseTimer = document.getElementById('paused-timer');
		if (!pauseTimer) return;

		pauseTimer.textContent = ((timeRemaining / 1000).toFixed(2));
	}


	// scoreboard overlay
	createScoreboardOverlay() {
		if (existingUI('scoreboard')) return;

		const scoreboard = document.createElement('div');
		scoreboard.id = 'scoreboard';
		scoreboard.classList.add('overlay')

		const winner = document.createElement('div');
		winner.id = 'winner';

		const scores = document.createElement('table');
		scores.id = 'scores';

		const thead = document.createElement('thead');
		thead.id = 'scores-head';

		const row = document.createElement('tr');

		const column1 = document.createElement('th');
		column1.textContent = `Player`

		const column2 = document.createElement('th');
		column2.textContent = `Score`

		const tbody = document.createElement('tbody');
		tbody.id = 'scores-body';

		row.appendChild(column1);
		row.appendChild(column2);
		thead.appendChild(row);
		scores.appendChild(thead);
		scores.appendChild(tbody);

		scoreboard.appendChild(winner);
		scoreboard.appendChild(scores);

		return scoreboard;
	}

	showScoreboard(playerId, gameId) {
		const scoreboard = document.getElementById('scoreboard');

		this.updateWinnerAndScores(playerId, gameId);

		scoreboard.style.display = 'flex'
	}

	// todo base score on lives left + kills. Currently based on lives left
	updateWinnerAndScores(winnerId, gameId) {
		const game = this.#clientStore.games.get(gameId);
		const winner = game.state.players[winnerId];

		const winnerElement = document.getElementById('winner');
		const scoresBody = document.getElementById('scores-body');

		for (let playerId in game.state.players) {
			const player = game.state.players[playerId];
			const playerRow = document.createElement('tr');
			const nameCell = document.createElement('td');
			nameCell.textContent = `${player.name}`;
			const scoreCell = document.createElement('td');
			scoreCell.textContent = `${player.score}`;
			playerRow.classList.add('player-score');
			playerRow.appendChild(nameCell);
			playerRow.appendChild(scoreCell);
			scoresBody.appendChild(playerRow);
 		}

		if (winnerId === null) {
			winnerElement.innerHTML = (`The game is a draw!`);
		} else if (winnerId) {
			if (winnerId === this.#clientStore.myId) {
				winnerElement.textContent = `You won the game!`;
			} else {
				winnerElement.textContent = `${winner.name} has won the game!`;
			}

			const trophy = document.createElement("i");
			trophy.classList.add("fas", "fa-trophy");
			winnerElement.appendChild(trophy);
		}
	}

	getFinalScores(players) {
		const sorted = Object.values(players).sort((a, b) => b.score - a.score);
		let html = '<h3>Final Scores:</h3>';
		sorted.forEach((player, i) => {
			html += `<div style="margin: 5px 0; ${i === 0 ? 'font-weight: bold; color: gold;' : ''}">${i + 1}. ${player.name}: ${player.score} lives</div>`;
		});
		return html;
	}

	createNotification() {
		const notification = document.createElement('div');
		notification.id = 'notification';
		return notification;
	}

	showNotification(text) {
		const notification = document.getElementById('notification');
		notification.textContent = text;
		notification.style.display = 'flex';

		setTimeout(() => {
			notification.style.display = 'none';
			notification.textContent = "";
		}, 3000)
	}

	// instructions overlay
	createInstructionsOverlay() {
		if (existingUI('instructions')) return;
		const instructions = document.getElementById('instructions');
		instructions.id = 'instructions';
		instructions.classList.add('overlay');
		return instructions;
	}

	showInstructions() {
		const scoreboard = document.getElementById('instructions')
		scoreboard.style.display = 'flex'
	}

	hideInstructions() {
		const scoreboard = document.getElementById('instructions')
		scoreboard.style.display = 'none'
	}

	// lobby overlay
	createLobbyOverlay() {
		if (existingUI('lobby')) return;

		const lobby = document.createElement('div');
		lobby.id = 'lobby';
		lobby.classList.add('overlay')

		const lobbyPlayersCount = this.createLobbyPlayersCount();
		const lobbyGameId = this.createLobbyGameId();

		lobby.append(lobbyGameId);
		lobby.append(lobbyPlayersCount);

		// start button only for the host
		if (this.#clientStore.gameId === this.#clientStore.myId) {
			const startButton = this.createStartButton();
			lobby.append(startButton);
		}

		return lobby;
	}

	hideLobby() {
		const lobby = document.getElementById('lobby')
		if (lobby.style.display !== 'none') {
			lobby.style.display = 'none'
		}
	}

	showLobby() {
		const lobby = document.getElementById('lobby')
		lobby.style.display = 'flex'
	}

	createStartButton() {
		if (existingUI('start-button')) return;


		const startButton = document.createElement('button');
		startButton.id = 'start-button';
		startButton.textContent = 'Start';
		startButton.disabled = true;
		startButton.addEventListener('click', () => {
			this.#socketHandler.socket.emit('gameStatusChange', this.#clientStore.gameId, "started", this.#clientStore.myId)
			// this.hideLobby();
		})

		return startButton;
	}

	enableStartButton() {
		const startButton = document.getElementById('start-button');

		const store = this.#clientStore;
		const game = store.games.get(store.gameId);

		// todo use actual player count. Currently +1 because at this point the new player object has not been created
		const playerCount = Object.keys(game.state.players).length + 1

		if (playerCount >= 2 && playerCount <= 4) {
			startButton.disabled = false;
		}
	}

	createLobbyGameId() {
		if (existingUI('lobby-game-id')) return;

		const gameIdElement = document.createElement('button');
		gameIdElement.id = 'lobby-game-id';
		gameIdElement.title = "Double click to copy";
		const gameId = this.#clientStore.gameId;
		gameIdElement.textContent = `${gameId}`;


		gameIdElement.addEventListener("dblclick", () => {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(gameId)
					.then(() => {
						gameIdElement.textContent = "Copied!";
						setTimeout(() => { gameIdElement.textContent = gameId; }, 1000);
					})
					.catch(() => alert("Failed to copy!"));
			} else {
				alert("Clipboard not supported");
			}
		});

		return gameIdElement;
	}


	createLobbyPlayersCount() {
		if (existingUI('lobby-players-count')) return;

		const lobbyPlayersCount = document.createElement('div');
		lobbyPlayersCount.id = 'lobby-players-count';

		return lobbyPlayersCount;
	}

	updateLobbyPlayersCount() {
		const element = document.getElementById('lobby-players-count');
		if (!element) return;

		const store = this.#clientStore;
		const game = store.games.get(store.gameId);
		const playersCount = Object.keys(game.state.players).length;
		const maxPlayers = game.settings.maxPlayers;
		element.textContent = `Players: ${playersCount}/${maxPlayers}`;
	}

	generateWalls() {
		const gameInner = document.getElementById('game-inner');

		const { TILE_SIZE, TILES_X } = this.#mapConfig;

		for (let i = 0; i < this.#map.length; i++) {
			if (this.#map[i] === 0) continue;

			const x = i % TILES_X;
			const y = Math.floor(i / TILES_X);

			const wallDiv = document.createElement('div');
			wallDiv.id = i;
			wallDiv.className = 'wall-tile';

			wallDiv.style.left = `${x * TILE_SIZE}px`;
			wallDiv.style.top = `${y * TILE_SIZE}px`;
			// wallDiv.style.width = `${TILE_SIZE}px`;
			// wallDiv.style.height = `${TILE_SIZE}px`;

			gameInner.appendChild(wallDiv);
		}
	}
}
