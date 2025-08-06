import {io} from 'socket.io-client';
import Player from '../models/Player.js';
import Bullet from '../models/Bullet.js';
import PlayerInterface from '../models/PlayerInterface.js';

export default class SocketHandler {
	#socket;
	#listeners = {}

	#playerService;
	#playerInterfaceService;
	#gameInterface
	#gameInterfaceService;
	#gameFieldService;
	#clientManager;
	#gameService;
	#clientStore;

	constructor({playerService, playerInterfaceService, gameInterface, gameInterfaceService, gameFieldService, clientStore}) {
		this.#playerService = playerService;
		this.#playerInterfaceService = playerInterfaceService;
		this.#gameInterface = gameInterface;
		this.#gameInterfaceService = gameInterfaceService;
		this.#gameFieldService = gameFieldService;
		this.#clientStore = clientStore;
	}

	get socket() {
		return this.#socket;
	}

	set socket(socket) {
		this.#socket = socket;
	}

	setClientManager(clientManager) {
		this.#clientManager = clientManager;
	}

	setGameService(gameService) {
		this.#gameService = gameService;
	}

	initializePlayers(players, myPlayer) {
		if (!this.#clientStore.myId) {
			this.#clientStore.myId = myPlayer.id;
		}

		const gameState = this.#clientStore.currentGame.state;

		for (const playerID in players) {
			gameState.players[playerID] = new Player(playerID, players[playerID].name);
			console.log("gameState.players[playerID]:", gameState.players[playerID]);
			this.#playerService.createPlayerModel(players[playerID], playerID);

			// todo I don't think it's necessary to create the playerInterface object and save it for each player
			gameState.interfaces[playerID] = new PlayerInterface(playerID);

			if (playerID === myPlayer.id) {
				this.#playerInterfaceService.createPlayerUI(playerID);
			}
		}
	}

	initializeGameField(mapType) {
		this.#gameFieldService.createElement(mapType);
	}

	startGame(gameId, settings, players, myPlayer) {
		console.log("Starting game");
		this.initializeGameField(settings.mapType);
		this.initializePlayers(players, myPlayer);
		this.#gameInterfaceService.createGameUI(gameId, players);
		this.#clientManager.startRenderLoop();
	}

	on(event, callback) {
		if (callback === null) {
			delete this.#listeners[event];
		}

		if (this.#listeners[event]) {
			this.socket.off(event, this.#listeners[event]);
		}
		this.#listeners[event] = callback;

		if (callback) {
			this.socket.on(event, callback);
		}
	}

	connectToServer() {
		this.socket = io();
		const socket = this.socket;

		socket.on('connect', () => {
			console.log('Connected to server with ID:', this.socket.id);
			this.socket.emit('fetchAvailableGames');
		})

		socket.on('updateAvailableGames', (gamesList) => {
			this.#clientStore.games = new Map(
				gamesList.map(game => [game.id, { settings: game.settings }])
			);

			console.log("Updating available games: ", this.#clientStore.games);

			if (this.#listeners["updateAvailableGames"]) {
				this.#listeners["updateAvailableGames"](gamesList);
			}
		})

		socket.on('createGameSuccess', (gameId, state, settings) => {

			// todo use updateGames method instead
			this.#clientStore.games.set(gameId, {state, settings});
			console.log("Game created: ", gameId, this.#clientStore.games);
		})

		socket.on('joinGameSuccess', ({gameId, players, myPlayer}) => {
			console.log("Game:", gameId, "joined by player: ", myPlayer.id);

			if (this.#listeners["joinGameSuccess"]) {
				this.#listeners["joinGameSuccess"]();
			}

			this.#clientStore.gameId = gameId;

			const game = this.#clientStore.games.get(gameId);

			// console.log("games:", this.#clientStore.games);

			this.startGame(gameId, game.settings, players, myPlayer);
		})

		socket.on('error', (message) => {
			console.log("Error:", message);

			if (this.#listeners["error"]) {
				this.#listeners["error"](message);
			}

		})

		socket.on('playerJoined', (playerId) => {
			console.log("Player:", playerId, "joined the game");
		})

		socket.on('playerLeft', (playerId) => {
			console.log("Player:", playerId, "left the game");
		})

		// todo refactor this socket connection
		socket.on('updateGameState', (gameId, updatedGameState) => {
			const currentGameState = this.#clientStore.currentGame.state;

			if (!currentGameState) {
				console.warn(`No game found with ID ${gameId}`);
				return;
			}

			// todo probably don't need to hold the same value in both places
			this.#gameInterface.gameId = gameId;
			this.#clientStore.currentGame.id = gameId;

			// Respawning
			for (const playerID in updatedGameState.players) {
				if (!currentGameState.players[playerID]) {
					currentGameState.players[playerID] = new Player(playerID, updatedGameState.players[playerID].name);
					console.log("Creating player model for:", updatedGameState.players[playerID]);
					this.#playerService.createPlayerModel(updatedGameState.players[playerID], playerID);
				}
			}

			for (const playerID in currentGameState.players) {
				const player = currentGameState.players[playerID];
				const updatedPlayer = updatedGameState.players[playerID];

				if (!updatedPlayer) {
					const element = document.getElementById(playerID);
					if (element) element.remove();
					delete currentGameState.players[playerID];
					continue;
				}

				if (player) {
					// player.name = updatedPlayer.name;
					player.position = updatedPlayer.pos;
					player.hp = updatedPlayer.hp;
					player.status = updatedPlayer.status;
					player.respawnTimer = updatedPlayer.respawnTimer;
					player.size = updatedPlayer.size;
					// player.maxPosition = updatedPlayer.maxPos;
					player.deathCooldown = updatedPlayer.deathCooldown;
				}
			}

			for (const bulletID in updatedGameState.bullets) {

				if (!currentGameState.bullets[bulletID]) {
					currentGameState.bullets[bulletID] = new Bullet(bulletID);
					this.#gameService.createBulletModel(updatedGameState.bullets[bulletID], bulletID);
				}  else {
					currentGameState.bullets[bulletID].position = updatedGameState.bullets[bulletID].position;
				}
			}

			// Delete bullet from client if not present in game state sent from server
			for (const bulletID in currentGameState.bullets) {
				if (!updatedGameState.bullets[bulletID]) {
					const bulletElement = document.getElementById(bulletID);
					if (bulletElement) {
						bulletElement.remove();
					}
					delete currentGameState.bullets[bulletID];
				}
			}
		})

		socket.on('disconnect', () => {
			console.log('Disconnected from the server ');
		})
	}
}
