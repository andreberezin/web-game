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

	initializeGameField(mapType, gameId, myId) {
		const gameField = this.#gameFieldService
		gameField.createElement(mapType);

		const game = this.#clientStore.games.get(gameId);

		if (gameId === myId) {
			// create and append start game button
			gameField.createStartButton(game);
		} else {
			// create and append a message that says, "Waiting for the host to start the game..."
		}
	}

	// todo probably should be part of GameService class instead
	createGame(gameId, myId) {
		const game  = this.#clientStore.games.get(gameId);

		const players = game.state.players;
		const settings = game.settings;

		this.initializeGameField(settings.mapType, gameId, myId);
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

		this.on('createGameSuccess', (gameId) => {


			//this.#clientStore.games.set(gameId, {id: gameId, state, settings});

			// this.setCurrentGame(gameId, state, settings);

			console.log("Game created: ", gameId);
		})

		this.on('joinGameSuccess', (gameId, state, settings, myId) => {
			console.log("Game:", gameId, "joined by player: ", myId);

			if (this.#externalListeners["joinGameSuccess"]) {
				this.#externalListeners["joinGameSuccess"]();
			}
			this.#clientStore.gameId = gameId;

			// if the game object is not found in the Map then create the game object
			if (!this.#clientStore.games.has(gameId)) {
				this.#clientStore.games.set(gameId, {id: gameId, state: {}, settings: {}});
			}

			// update the Map so references are kept working
			const game = this.#clientStore.games.get(gameId);
			game.state = {...game.state, ...state};
			game.settings = {...game.settings, ...settings};

			this.createGame(gameId, myId);


			// todo refactor this socket connection into smaller methods
			this.on('updateGameState', (gameId, updatedGameState) => {
				// console.log("updated state:", gameId, updatedGameState);

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
					if (currentGameState.timeRemaining <= 0 && currentGameState.status !== "finished") {
						socket.emit('gameStatusChange', "finished")
						return;
					}

				} else {
					console.error("Cannot update time remaining")
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
		})

		// todo more error handling
		socket.on('error', (message) => {
			console.log("Error:", message);

			if (this.#listeners["error"]) {
				this.#listeners["error"](message);
			}

		})

		this.on('playerJoined', (playerId) => {
			console.log("Player:", playerId, "joined the game");
		})

		this.on('playerLeft', (playerId) => {
			console.log("Player:", playerId, "left the game");
		})


		this.on('gameStatusChangeSuccess', (gameId, status) => {
			this.#clientStore.games.get(gameId).state.status = status;
			console.log("Game status changed: ", status);

			switch (status) {
				case "waiting":
					break;
				case "started":
					break;
				case "paused":
					break;
				case "finished":
					this.#gameFieldService.showScoreboard();
					// this.#gameService.handleGameFinish(gameId);
					setTimeout(() => {
						this.#clientManager.gameCleanup(gameId);
					}, 1000)
					break;
				default:
					console.log("default: ", status);

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
	}
}
