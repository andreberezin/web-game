import {useEffect} from 'react';
import {io} from 'socket.io-client';
import {Player} from '../models/Player.js';

export class SocketHandler {
	socket;
	#playerService;
	#clientManager;

	constructor(playerService) {
		this.#playerService = playerService;
	}

	setClientManager(clientManager) {
		this.#clientManager = clientManager;
	}

	connectToServer() {
		console.log('Connecting to socket...');
		const gameState = this.#clientManager.game.state;

		this.socket = io();

		this.socket.on('connect', () => {
			console.log('Connected to server with ID:', this.socket.id);
			this.socket.emit('createNewPlayerAndFetchOtherPlayers');
		});


		//player.insertPlayer();
		/*this.socket.on('sendOtherPlayers', (playersData) => {
			//console.log("Creating players: ", playersData);

			let i = 1;
			for (const playerID in playersData) {
				//console.log("playersData:", playersData);

				if (playerID !== this.#clientManager.myID) {
					let player = new Player(playerID);
					//gameState.players[playerID].setName(`player${i}`);
					gameState.players[playerID] = player;
					this.#playerService.createPlayerModel(playersData[playerID], playerID);
					i++;
				}
			}

			i = 0;
		})*/


		this.socket.on('newPlayerCreatedAndSendingOtherPlayers', (newPlayer, playerID, playersData) => {
			console.log("newPlayerCreatedAndSendingOtherPlayers: ", playerID);
			let player = new Player(playerID);

			if (!this.#clientManager.myID) {
				this.#clientManager.myID = playerID;
			}

			gameState.players[playerID] = player;
			this.#playerService.createPlayerModel(newPlayer, playerID);
			//console.log("gameState:", gameState);


			let i = 1;
			for (const playerID in playersData) {
				//console.log("playersData:", playersData);

				if (playerID !== this.#clientManager.myID) {
					let player = new Player(playerID);
					//gameState.players[playerID].setName(`player${i}`);
					gameState.players[playerID] = player;
					this.#playerService.createPlayerModel(playersData[playerID], playerID);
					i++;
				}
			}

			i = 0;
		})

		this.socket.on('UpdateGameState', (updatedGameState) => {
			//console.log("updated game state in frontend: ", updatedGameState);

			//console.log("updatedGameState: ", updatedGameState);
			//console.log("gamestate players: ", gameState.players)
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
		})
	}
}
