import {io} from 'socket.io-client';
import Player from '../models/Player.js';
import Bullet from '../models/Bullet.js';
import Powerup from "../models/Powerup.js";

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

	initializePlayers(gameId, players, myPlayer) {
		if (!this.#clientStore.myId) {
			this.#clientStore.myId = myPlayer.id;
		}

		const gameState = this.#clientStore.games.get(gameId).state;
		let currentIndex = Object.keys(gameState.players).length

		for (const playerID in players) {
			// if (!gameState.players[playerID]) {
				currentIndex++;
				gameState.players[playerID] = new Player(playerID, players[playerID].name);
				gameState.players[playerID].colorIndex = currentIndex;
				this.#playerService.createPlayerModel(players[playerID], playerID);

				// todo I don't think it's necessary to create the playerInterface object and save it for each player
				//gameState.interfaces[playerID] = new PlayerInterface(playerID);

			//}

			if (playerID === myPlayer.id) {
				this.#playerInterfaceService.createPlayerUI(playerID);
			}
		}
	}

	initializeGameField(mapType) {
		this.#gameFieldService.createElement(mapType);
	}

	startGame(gameId, myId) {
		const game  = this.#clientStore.games.get(gameId);

		const players = game.state.players;
		const settings = game.settings;

		this.initializeGameField(settings.mapType);
		this.initializePlayers(gameId, players, players[myId]);
		this.#gameInterfaceService.createGameUI(gameId, settings, players);
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

	// setCurrentGame(gameId, state, settings) {
	// 	this.#clientStore.gameId = gameId;
	// 	this.#clientStore.currentGame.id = gameId;
	//
	// 	// todo should have update functions for these
	// 	this.#clientStore.currentGame.state = state;
	// 	this.#clientStore.currentGame.settings = settings;
	// }

	connectToServer() {
		this.socket = io();
		const socket = this.socket;

		socket.on('connect', () => {
			console.log('Connected to server with ID:', this.socket.id);
			this.socket.emit('fetchAvailableGames');
		})

		socket.on('updateAvailableGames', (gamesList) => {
			// todo this does nothing currently. Possibly go back to having a list of available games with minimal information and 1 object with current game data rather than having a single Map with all the data for all games
			// this.#clientStore.games = new Map(
			// 	gamesList.map(game => [game.id, { settings: game.settings, state: game.state }])
			// );

			// console.log("Updating available games: ", this.#clientStore.games);

			if (this.#listeners["updateAvailableGames"]) {
				this.#listeners["updateAvailableGames"](gamesList);
			}
		})

		socket.on('createGameSuccess', (gameId) => {


			//this.#clientStore.games.set(gameId, {id: gameId, state, settings});

			// this.setCurrentGame(gameId, state, settings);

			console.log("Game created: ", gameId);
		})

		socket.on('joinGameSuccess', (gameId, state, settings, myId) => {
			console.log("Game:", gameId, "joined by player: ", myId);

			if (this.#listeners["joinGameSuccess"]) {
				this.#listeners["joinGameSuccess"]();
			}
			this.#clientStore.gameId = gameId;
			if (!this.#clientStore.games.has(gameId)) {
				this.#clientStore.games.set(gameId, {id: gameId, state: {}, settings: {}});
			}
			const game = this.#clientStore.games.get(gameId);
			game.state = {...game.state, ...state};
			game.settings = {...game.settings, ...settings};

			this.startGame(gameId, myId);
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
			// console.log("updated state:", gameId, updatedGameState);

			const game = this.#clientStore.games.get(gameId)

			if (!game) {
				console.warn(`No game found with ID ${gameId}`);
				return;
			}

			const currentGameState = game.state;

			currentGameState.timeRemaining = updatedGameState.timeRemaining;

			// todo probably don't need to hold the same value in both places
			this.#gameInterface.gameId = gameId;
			this.#clientStore.gameId = gameId;

			// Respawning
			for (const playerID in updatedGameState.players) {
				if (!currentGameState.players[playerID]) {
					currentGameState.players[playerID] = new Player(playerID, updatedGameState.players[playerID].name);
					//console.log("Creating player model for:", updatedGameState.players[playerID]);
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
					player.pos = updatedPlayer.pos;
					player.hp = updatedPlayer.hp;
					player.status = updatedPlayer.status;
					player.respawnTimer = updatedPlayer.respawnTimer;
					player.size = updatedPlayer.size;
					// player.maxPos = updatedPlayer.maxPos;
					player.deathCooldown = updatedPlayer.deathCooldown;
				}
			}

			for (const bulletID in updatedGameState.bullets) {
				const bullet = updatedGameState.bullets[bulletID];

				if (!currentGameState.bullets[bulletID]) {
					currentGameState.bullets[bulletID] = new Bullet(bulletID, bullet.pos.x, bullet.pos.y, bullet.direction);
					this.#gameService.createBulletModel(bullet, bulletID);
				}  else {
					// console.log(updatedGameState.bullets[bulletID].position);
					currentGameState.bullets[bulletID].pos = bullet.pos;
				}
			}

			// Delete the bullet from the client if not present in game state sent from server
			for (const bulletID in currentGameState.bullets) {
				if (!updatedGameState.bullets[bulletID]) {
					const bulletElement = document.getElementById(bulletID);
					if (bulletElement) {
						bulletElement.remove();
					}
					delete currentGameState.bullets[bulletID];
				}
			}

			for (const powerupID in updatedGameState.powerups) {
				const powerup = updatedGameState.powerups[powerupID];

				if (!currentGameState.powerups[powerupID]) {
					currentGameState.powerups[powerupID] = new Powerup(powerupID, powerup.pos.x, powerup.pos.y);
					this.#gameService.createPowerupModel(powerup, powerupID);
				}  else {
					// console.log(updatedGameState.powerups[powerupID].position);
					currentGameState.powerups[powerupID].pos = powerup.pos;
				}
			}

			// Delete the powerup from the client if not present in game state sent from server
			for (const powerupID in currentGameState.powerups) {
				if (!updatedGameState.powerups[powerupID]) {
					const powerupElement = document.getElementById(powerupID);
					if (powerupElement) {
						powerupElement.remove();
					}
					delete currentGameState.powerups[powerupID];
				}
			}
		})

		socket.on('disconnect', () => {
			console.log('Disconnected from the server ');
		})
	}
}
