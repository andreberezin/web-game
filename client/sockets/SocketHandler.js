import {io} from 'socket.io-client';
import Player from '../models/Player.js';
import Bullet from '../models/Bullet.js';
import PlayerInterface from '../models/PlayerInterface.js';

export default class SocketHandler {
	socket;
	#playerService;
	#playerInterfaceService;
	#gameInterface
	#gameInterfaceService;
	#gameFieldService;
	#clientManager;
	#gameService;
	#onUpdateAvailableGames = null;

	constructor({playerService, playerInterfaceService, gameInterface, gameInterfaceService, gameFieldService}) {
		this.#playerService = playerService;
		this.#playerInterfaceService = playerInterfaceService;
		this.#gameInterface = gameInterface;
		this.#gameInterfaceService = gameInterfaceService;
		this.#gameFieldService = gameFieldService;
	}

	setClientManager(clientManager) {
		this.#clientManager = clientManager;
	}

	setGameService(gameService) {
		this.#gameService = gameService;
	}

	initializePlayers(players, myPlayer) {
		if (!this.#clientManager.myID) {
			this.#clientManager.myID = myPlayer.id;
		}

		const gameState = this.#clientManager.game.state;

		for (const playerID in players) {
			gameState.players[playerID] = new Player(playerID, players[playerID].name);
			console.log("gameState.players[playerID]:", gameState.players[playerID]);
			this.#playerService.createPlayerModel(players[playerID], playerID);

			gameState.interfaces[playerID] = new PlayerInterface(playerID);

			if (playerID === myPlayer.id) {
				this.#playerInterfaceService.createPlayerUI();
			}
		}
	}

	initializeGameField(gameFieldType) {
		this.#gameFieldService.createElement(gameFieldType);
	}

	startGame(settings, players, myPlayer) {
		console.log("Starting game");
		this.initializeGameField(settings.gameField);
		this.initializePlayers(players, myPlayer);
		this.#gameInterfaceService.createGameUI();
		this.#clientManager.startRenderLoop();
	}

	onUpdateAvailableGames(callback) {
		this.#onUpdateAvailableGames = callback;
	}

	connectToServer() {
		this.socket = io();
		const socket = this.socket;

		socket.on('connect', () => {
			console.log('Connected to server with ID:', this.socket.id);
			this.socket.emit('fetchAvailableGames');
		})

		socket.on('updateAvailableGames', (gamesList) => {
			//console.log("Updating available games");
			this.#clientManager.games = new Map(gamesList);

			if (this.#onUpdateAvailableGames) {
				this.#onUpdateAvailableGames(gamesList)
			}
		})

		socket.on('createGameSuccess', (gameId, state, settings) => {
			this.#clientManager.games.set(gameId, {state, settings});
			console.log("Game created: ", gameId, this.#clientManager.games);
		})

		socket.on('joinGameSuccess', ({gameId, players, myPlayer}) => {
			console.log("Game:", gameId, "joined by player: ", myPlayer.id);

			this.#clientManager.currentGameId = gameId;

			const game = this.#clientManager.games.get(gameId);

			this.startGame(game.settings, players, myPlayer);
		})

		socket.on('joinGameFailed', (gameId) => {
			console.log("Failed to join game: ", gameId);
		})

		socket.on('playerJoined', (playerId) => {
			console.log("Player:", playerId, "joined the game");
		})

		socket.on('playerLeft', (playerId) => {
			console.log("Player:", playerId, "left the game");
		})

		// todo refactor this socket connection
		socket.on('updateGameState', (gameId, updatedGameState) => {
			const currentGameState = this.#clientManager.game.state;

			if (!currentGameState) {
				console.warn(`No game found with ID ${gameId}`);
				return;
			}

			this.#gameInterface.gameId = gameId;
			this.#clientManager.game.id = gameId;

			// Respawning
			for (const playerID in updatedGameState.players) {
				if (!currentGameState.players[playerID]) {
					currentGameState.players[playerID] = new Player(playerID);
					console.log("Creating player model");
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
					player.name = updatedPlayer.name;
					player.position = updatedPlayer.pos;
					player.hp = updatedPlayer.hp;
					player.status = updatedPlayer.status;
					player.respawnTimer = updatedPlayer.respawnTimer;
					player.size = updatedPlayer.size;
					player.maxPosition = updatedPlayer.maxPos;
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
