import {io} from 'socket.io-client';
import {Player} from '../models/Player.js';
import {Bullet} from '../models/Bullet.js';
import {PlayerInterface} from '../models/PlayerInterface.js';

export class SocketHandler {
	socket;
	#playerService;
	#playerInterfaceService;
	#gameInterface
	#clientManager;
	#gameService;

	constructor(playerService, playerInterfaceService, gameInterface) {
		this.#playerService = playerService;
		this.#playerInterfaceService = playerInterfaceService;
		this.#gameInterface = gameInterface;
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
			gameState.players[playerID] = new Player(playerID);
			this.#playerService.createPlayerModel(players[playerID], playerID);

			gameState.interfaces[playerID] = new PlayerInterface(playerID);

			if (playerID === myPlayer.id) {
				this.#playerInterfaceService.createPlayerUI();
			}
		}
	}

	connectToServer() {
		this.socket = io();
		const socket = this.socket;

		socket.on('connect', () => {
			console.log('Connected to server with ID:', this.socket.id);
			this.socket.emit('fetchAvailableGames');
		})

		socket.on('availableGames', (games) => {
			this.#clientManager.games = new Map(games);
			console.log("Available games: ", new Map(games));
		})

		socket.on('createGameSuccess', (gameId, gameState, gameSettings) => {
			this.#clientManager.games.set(gameId, {gameState, gameSettings});
			console.log("Game created: ", gameId, this.#clientManager.games.get(gameId));

			this.initializePlayers(gameState.players, gameState.players[gameId]);
		})

		socket.on('joinGameSuccess', ({gameId, players, myPlayer}) => {
			console.log("Game: ", gameId, " joined by player: ", myPlayer.id);

			this.initializePlayers(players, myPlayer);
		})

		socket.on('playerJoined', (playerId) => {
			console.log("A new player joined the game:", playerId);
		})

		// todo refactor this socket connection
		socket.on('updateGameState', (gameId, updatedGameState) => {
			//console.log("updating game state: ", gameId);
			const currentGameState = this.#clientManager.game.state;

			if (!currentGameState) {
				console.warn(`No game found with ID ${gameId}`);
				return;
			}

			this.#gameInterface.setGameId(gameId);
			this.#clientManager.game.id = gameId;

			// Respawning
			for (const playerID in updatedGameState.players) {
				if (!currentGameState.players[playerID]) {
					currentGameState.players[playerID] = new Player(playerID);
					this.#playerService.createPlayerModel(updatedGameState.players[playerID], playerID);
				}
			}

			// console.log("game id: ", gameId);
			for (const playerID in currentGameState.players) {
				if (!updatedGameState.players[playerID]) {
					document.getElementById(playerID).remove();
					delete currentGameState.players[playerID];
					continue;
				}

				if (currentGameState.players[playerID]) {
					currentGameState.players[playerID].setPosition(updatedGameState.players[playerID].pos);
					currentGameState.players[playerID].setShift(updatedGameState.players[playerID].shift);
					currentGameState.players[playerID].setHp(updatedGameState.players[playerID].hp);
				}
			}

			for (const bulletID in updatedGameState.bullets) {

				if (!currentGameState.bullets[bulletID]) {
					let bullet = new Bullet(bulletID);

					currentGameState.bullets[bulletID] = bullet;
					this.#gameService.createBulletModel(updatedGameState.bullets[bulletID], bulletID);
				}  else {
					currentGameState.bullets[bulletID].setPosition(updatedGameState.bullets[bulletID].pos);
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
