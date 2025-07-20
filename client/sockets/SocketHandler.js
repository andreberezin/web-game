import {io} from 'socket.io-client';
import {Player} from '../models/Player.js';
import {Bullet} from "../models/Bullet.js";
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

	connectToServer() {
		const gameState = this.#clientManager.game.state;

		this.socket = io();

		this.socket.on('connect', () => {
			console.log('Connected to server with ID:', this.socket.id);
			this.socket.emit('fetchGameId')
			this.socket.emit('createMyPlayer');
			this.socket.emit('fetchOtherPlayers');
		});

		// this.socket.on('sendGameId', (gameId) => {
		// 	this.#clientManager.game.id = gameId;
		// 	this.#gameInterface.setGameId(gameId);
		// 	console.log("game id when fetched from backend: ", gameId);
		// })

		this.socket.on('sendOtherPlayers', (playersData) => {
			let i = 1;

			for (const playerID in playersData) {
				if (playerID !== this.#clientManager.myID) {
					let player = new Player(playerID);
					let playerInterface = new PlayerInterface(playerID);
					//gameState.players[playerID].setName(`player${i}`);
					gameState.players[playerID] = player;
					gameState.interfaces[playerID] = playerInterface;
					this.#playerService.createPlayerModel(playersData[playerID], playerID);
					//console.log("gameState:", gameState);
					i++;
				}
			}

			i = 0;
		})


		this.socket.on('myPlayerCreated', (newPlayer, playerID) => {
			let player = new Player(playerID);
			let playerInterface = new PlayerInterface(playerID);
			gameState.players[playerID] = player;
			gameState.interfaces[playerID] = playerInterface;
			this.#playerService.createPlayerModel(newPlayer, playerID);

			const myId = this.#clientManager.myID;
			if (!myId) {
				this.#clientManager.myID = playerID;
			}
			this.#playerInterfaceService.createPlayerUI();

			//this.#clientManager.myID = playerID;

			// let i = 1;
			// for (const playerID in playersData) {
			// 	//console.log("playersData:", playersData);
			//
			// 	if (playerID !== myId) {
			// 		let player = new Player(playerID);
			// 		//gameState.players[playerID].setName(`player${i}`);
			// 		gameState.players[playerID] = player;
			// 		this.#playerService.createPlayerModel(playersData[playerID], playerID);
			// 		i++;
			// 	}
			// }
			//
			// i = 0;
		})


		this.socket.on('updateGameState', (gameId, updatedGameState) => {

			this.#gameInterface.setGameId(gameId);
			this.#clientManager.game.id = gameId;

			// console.log("game id: ", gameId);
			for (const playerID in gameState.players) {
				if (!updatedGameState.players[playerID]) {
					document.getElementById(playerID).remove();
					delete gameState.players[playerID];
					continue;
				}

				if (gameState.players[playerID]) {
					gameState.players[playerID].setPosition(updatedGameState.players[playerID].pos);
					gameState.players[playerID].setShift(updatedGameState.players[playerID].shift);
				}
			}

			for (const bulletID in updatedGameState.bullets) {

				if (!gameState.bullets[bulletID]) {
					let bullet = new Bullet(bulletID);

					gameState.bullets[bulletID] = bullet;
					this.#gameService.createBulletModel(updatedGameState.bullets[bulletID], bulletID);
				}  else {
					gameState.bullets[bulletID].setPosition(updatedGameState.bullets[bulletID].pos);
				}
			}

			// Delete bullet from client if not present in game state sent from server
			for (const bulletID in gameState.bullets) {
				if (!updatedGameState.bullets[bulletID]) {
					const bulletElement = document.getElementById(bulletID);
					if (bulletElement) {
						bulletElement.remove();
					}
					delete gameState.bullets[bulletID];
				}
			}
		})
	}
}
