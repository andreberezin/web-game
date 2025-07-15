import {useEffect} from 'react';
import {io} from 'socket.io-client';
import {Player} from '../models/Player.js';
import {Bullet} from "../models/Bullet.js";

export class SocketHandler {
	socket;
	#playerService;
	#clientManager;
	#gameService;

	constructor(playerService) {
		this.#playerService = playerService;
	}

	setClientManager(clientManager) {
		this.#clientManager = clientManager;
	}

	setGameService(gameService) {
		this.#gameService = gameService;
	}

	connectToServer() {
		console.log('Connecting to socket...');
		const gameState = this.#clientManager.game.state;

		this.socket = io();

		this.socket.on('connect', () => {
			console.log('Connected to server with ID:', this.socket.id);
			this.socket.emit('createMyPlayer');
			this.socket.emit('fetchOtherPlayers');
		});


		//player.insertPlayer();
		this.socket.on('sendOtherPlayers', (playersData) => {
			//console.log("Creating players: ", playersData);

			let i = 1;
			for (const playerID in playersData) {
				console.log("players:", playersData);

				if (playerID !== this.#clientManager.myID) {
					let player = new Player(playerID);
					//gameState.players[playerID].setName(`player${i}`);
					gameState.players[playerID] = player;
					this.#playerService.createPlayerModel(playersData[playerID], playerID);
					//console.log("gameState:", gameState);
					i++;
				}
			}

			i = 0;
		})


		this.socket.on('myPlayerCreated', (newPlayer, playerID) => {
			let player = new Player(playerID);

			const myId = this.#clientManager.myID;
			if (!myId) {
				this.#clientManager.myID = playerID;
			}

			//this.#clientManager.myID = playerID;
			gameState.players[playerID] = player;
			this.#playerService.createPlayerModel(newPlayer, playerID);


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

		this.socket.on('UpdateGameState', (updatedGameState) => {
			//console.log("updated game state in frontend: ", updatedGameState);
			if (gameState.players) {

			}

			for (const playerID in gameState.players) {

				if (!updatedGameState.players[playerID]) {
					document.getElementById(playerID).remove();
					delete gameState.players[playerID];
					continue;
				}

				if (gameState.players[playerID]) { // ensure the player exists
					gameState.players[playerID].setPosition(updatedGameState.players[playerID].pos);
					gameState.players[playerID].setShift(updatedGameState.players[playerID].shift);
				}
			}

			// Update bullets
			for (const bulletID in updatedGameState.bullets) {

				if (!gameState.bullets[bulletID]) {
					//console.log("creating bullet");
					let bullet = new Bullet(bulletID);
					//gameState.bullets[bulletID].setName(`bullet${i}`);
					gameState.bullets[bulletID] = bullet;
					this.#gameService.createBulletModel(updatedGameState.bullets[bulletID], bulletID);
				}  else {
					gameState.bullets[bulletID].setPosition(updatedGameState.bullets[bulletID].pos);
				}
			}
		})
	}
}
