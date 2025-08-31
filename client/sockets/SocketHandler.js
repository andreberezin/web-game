import {io} from 'socket.io-client';
import Player from '../models/Player.js';
import Bullet from '../models/Bullet.js';
import Powerup from "../models/Powerup.js";

export default class SocketHandler {
	#socket;
	#listeners = {}
	#externalListeners = {}

	#playerService;
	#playerInterfaceService;
	#gameInterface
	#gameInterfaceService;
	#gameFieldService;
	#clientManager;
	#gameService;
	#clientStore;
	#powerupService;
	#bulletService;
	#notificationService;

	constructor({playerService, playerInterfaceService, gameInterface, gameInterfaceService, gameFieldService, clientStore, powerupService, bulletService, notificationService}) {
		this.#playerService = playerService;
		this.#playerInterfaceService = playerInterfaceService;
		this.#gameInterface = gameInterface;
		this.#gameInterfaceService = gameInterfaceService;
		this.#gameFieldService = gameFieldService;
		this.#clientStore = clientStore;
		this.#powerupService = powerupService;
		this.#bulletService = bulletService;
		this.#notificationService = notificationService;
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

	addExternalListener(event, callback) {
		this.#externalListeners[event] = callback;
	}

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

			if (this.#listeners["updateAvailableGames"]) {
				this.#listeners["updateAvailableGames"](gamesList);
			}
		})

		this.on('createGameSuccess', (gameId) => {
			console.log("Game created: ", gameId);

			if (!this.#clientStore.myId) {
				this.#clientStore.myId = gameId;
			}
		})

		this.on('joinGameSuccess', (gameId, state, settings, myId) => {
			console.log("Game:", gameId, "joined by player: ", myId);

			if (this.#externalListeners["joinGameSuccess"]) {
				this.#externalListeners["joinGameSuccess"]();
			}
			this.#clientStore.gameId = gameId;
			this.#clientStore.myId = myId;

			// if the game object is not found in the Map, then create the game object
			if (!this.#clientStore.games.has(gameId)) {
				this.#clientStore.games.set(gameId, {id: gameId, state: {}, settings: {}});
			}

			// update the Map so references are kept working
			const game = this.#clientStore.games.get(gameId);
			game.state = {...game.state, ...state};
			game.settings = {...game.settings, ...settings};

			this.#gameService.createGame(gameId, myId);
		})

		// todo refactor this monstrum
		this.on('updateGameState', (gameId, updatedGameState) => {

			const game = this.#clientStore.games.get(gameId)

			if (!game) {
				console.warn(`No game found with ID ${gameId}`);
				return;
			}

			const currentGameState = game.state;

			// handle time remaining
			if (currentGameState && updatedGameState) {
				currentGameState.timeRemaining = updatedGameState.timeRemaining;

				// handle timer end
				if (currentGameState.timeRemaining <= 0 && currentGameState.status === "started") {
					// todo goes here 5 times
					socket.emit('gameStatusChange', gameId, "finished")
					return;
				}

			} else {
				console.error("Cannot update time remaining")
			}

			if (currentGameState.status === "paused") {
				currentGameState.pause = {
					...currentGameState.pause,
					timeRemaining: updatedGameState.pause.timeRemaining,
				}
			}


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
					player.pos = updatedPlayer.pos;
					player.hp = updatedPlayer.hp;
					player.lives = updatedPlayer.lives;
					player.status = updatedPlayer.status;
					player.respawnTimer = updatedPlayer.respawnTimer;
					player.size = updatedPlayer.size;
					player.deathCooldown = updatedPlayer.deathCooldown;
					player.pauses = updatedPlayer.pauses;
				}
			}

			const livesDisplay = document.getElementById('lives-display');
			if (livesDisplay && currentGameState.players) {
				let html = '<strong>Lives:</strong><br>';
				Object.values(currentGameState.players).forEach(player => {
					html += `${player.name}: ${player.lives} ♥<br>`;
				});
				livesDisplay.innerHTML = html;
			}

			for (const bulletID in updatedGameState.bullets) {
				const bullet = updatedGameState.bullets[bulletID];

				if (!currentGameState.bullets[bulletID]) {
					currentGameState.bullets[bulletID] = new Bullet(bulletID, bullet.pos.x, bullet.pos.y, bullet.direction);
					this.#bulletService.createBulletModel(bullet, bulletID);
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
					currentGameState.powerups[powerupID] = new Powerup(powerupID, powerup.pos.x, powerup.pos.y, powerup.typeOfPowerup);
					this.#powerupService.createPowerupModel(powerup, powerupID);
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

			// Delete the destroyed wall from the client if not present in game state sent from server
			for (const destroyableWallID in currentGameState.mapOfDestroyableWalls) {
				if (!updatedGameState.mapOfDestroyableWalls[destroyableWallID]) {
					const destroyableWallElement = document.getElementById(destroyableWallID);
					if (destroyableWallElement) {
						destroyableWallElement.remove();
					}
					delete currentGameState.mapOfDestroyableWalls[destroyableWallID];
				}
			}
		})

		// todo more error handling
		socket.on('error', (message) => {
			console.error("Error:", message);

			if (this.#listeners["error"]) {
				this.#listeners["error"](message);
			}

		})

		this.on('playerJoined', (playerId, playerName) => {
			console.log("Player:", playerId, "joined the game");
			const text = `${playerName} joined`;
			this.#gameFieldService.showNotification(text);
			this.#gameFieldService.enableStartButton();
		})

		this.on('playerLeft', (playerId) => {
			console.log("Player:", playerId, "left the game");

			const playerName = this.#clientStore.games.get(this.#clientStore.gameId).state.players[playerId].name;
			const text = `${playerName} left`;
			this.#gameFieldService.showNotification(text);

			if (playerId === this.#clientStore.myId) {

				this.#gameService.leaveGame();
				this.cleanupGameListeners();
			} else {
				this.#playerService.removePlayerElement(playerId);
				delete this.#clientStore.games.get(this.#clientStore.gameId).state.players[playerId];
			}

		})

		this.on('gameStatusChangeSuccess', (gameId, status, playerId = null) => {
			console.log("Game status changed: ", status, "by player: ", playerId);

			if (status !== "finished") {
				this.#gameService.updateGameStatus(gameId, status, playerId);
			}

		});

		this.on('declareWinner', (gameId, player) => {
			if (player === null) {
				console.log("The game is a draw!");
				this.#gameService.updateGameStatus(gameId, "finished", null);
			} else if (player) {
				console.log("Player %s won the game!", player.name);
				this.#gameService.updateGameStatus(gameId, "finished", player.id);
			}
		});

		this.on('powerupNotification', (data) => {
			if (this.#notificationService && data.playerId === this.#clientStore.myId) {
				this.#notificationService.showPowerupNotification(data.powerupType);
				console.log(`Powerup collected! Type: ${data.powerupType}`);
			}
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from the server ');
		})
	}

	cleanupGameListeners() {
		this.on("createGameSuccess", null);
		this.on("joinGameSuccess", null);
		this.on("updateGameState", null);
		this.on("playerJoined", null);
		this.on("playerLeft", null);
		this.on("gameStatusChangeSuccess", null);
		this.on("declareWinner", null);
		this.on("powerupNotification", null);
	}
}
