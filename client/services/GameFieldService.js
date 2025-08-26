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
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
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

	createElement(mapType) {
		if (existingUI('game')) return;

		//console.log("Map type", mapType);
		const root = document.getElementById('root');
		const game = document.createElement('div');
		game.id = 'game';

		const gameField = document.createElement('div');
		gameField.id = 'game-field';
		gameField.addEventListener('click', () => {
			if (document.getElementsByClassName("me").length > 0) {
				document.getElementsByClassName("me")[0].focus();
			}
		})

		const gameInner = document.createElement('div');
		gameInner.id = 'game-inner';

		const lobby = this.createLobbyMenu();

		const scoreboard = this.createScoreboard();

		root.append(game);
		game.append(gameField);
		// game.append(scoreboard);
		gameField.append(gameInner);
		gameInner.append(lobby);
		gameInner.append(scoreboard)

		this.generateWalls();
	}

	removeGameElements() {
		const game = document.getElementById('game');
		// if (!game) return;
		game.remove();
	}

	createLobbyMenu() {
		if (existingUI('lobby')) return;

		const lobby = document.createElement('div');
		lobby.id = 'lobby';
		lobby.classList.add('overlay')

		const startButton = this.createStartButton();
		const lobbyPlayersCount = this.createLobbyPlayersCount();
		const lobbyGameId = this.createLobbyGameId();

		lobby.append(lobbyGameId);
		lobby.append(lobbyPlayersCount);
		lobby.append(startButton);

		return lobby;
	}

	createLobbyGameId() {
		if (existingUI('lobby-game-id')) return;

		const gameIdElement = document.createElement('button');
		gameIdElement.id = 'lobby-game-id';
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

	appendToGameField(element) {
		const gameField = document.getElementById("game-inner");
		if (!gameField) return;
		gameField.appendChild(element);
	}

	createStartButton() {
		if (existingUI('start-button')) return;


		const startButton = document.createElement('button');
		startButton.id = 'start-button';
		startButton.textContent = 'Start';
		startButton.addEventListener('click', () => {
			this.#socketHandler.socket.emit('gameStatusChange', this.#clientStore.gameId, "started")
			// this.hideLobby();
		})

		return startButton;
	}

	hideLobby() {
		const lobby = document.getElementById('lobby')
		lobby.style.display = 'none'
	}

	createScoreboard() {
		if (existingUI('scoreboard')) return;

		const scoreboard = document.createElement('div');
		scoreboard.id = 'scoreboard';
		scoreboard.classList.add('overlay')

		// const scores = this.createScores();
		//
		// scoreboard.append(scores);

		return scoreboard;
	}

	showScoreboard() {
		const scoreboard = document.getElementById('scoreboard')
		scoreboard.style.display = 'flex'
	}

	createInstructions() {
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
			wallDiv.className = 'wall-tile';

			// todo refactor this into scss
			wallDiv.style.position = 'absolute';
			wallDiv.style.left = `${x * TILE_SIZE}px`;
			wallDiv.style.top = `${y * TILE_SIZE}px`;
			wallDiv.style.width = `${TILE_SIZE}px`;
			wallDiv.style.height = `${TILE_SIZE}px`;
			wallDiv.style.backgroundColor = '#333';
			wallDiv.style.border = '1px solid #555';
			wallDiv.style.boxSizing = 'border-box';

			gameInner.appendChild(wallDiv);
		}
	}
}
