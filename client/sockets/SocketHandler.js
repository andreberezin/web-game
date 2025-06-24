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
			this.socket.emit('createNewPlayer');
			this.socket.emit('fetchOtherPlayers');
		});


		//player.insertPlayer();
		this.socket.on('sendOtherPlayers', (playersData) => {
			//console.log("Creating players: ", playersData);

			let i = 1;
			for (const playerID in playersData) {

				if (playerID !== this.#clientManager.myID) {
					let player = new Player(playerID);
					//gameState.players[playerID].setName(`player${i}`);
					this.#playerService.createPlayerModel(playersData[playerID], playerID);
					gameState.players[playerID] = player;
					i++;
				}
			}

			i = 0;
		})


		this.socket.on('newPlayerCreated', (newPlayer, playerID) => {
			let player = new Player(playerID);
			this.#clientManager.myID = playerID;
			this.#playerService.createPlayerModel(newPlayer, playerID);
			gameState.players[playerID] = player;
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
		})
	}
}
