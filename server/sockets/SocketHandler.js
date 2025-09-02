import Player from '../models/Player.js';
import container from '../di/container.js';

export default class SocketHandler {
	#io;
	#gamesManager;
	#gameService;
	#serverStore;

	constructor({io, serverStore}) {
		this.#io = io;
		this.#serverStore = serverStore;
	}

	get io() {
		return this.#io;
	}

	set io(io) {
		this.#io = io;
	}

	setGamesManager(gamesManager) {
		this.#gamesManager = gamesManager;
	}

	setGameService(gameService) {
		this.#gameService = gameService;
	}

	createSocketConnection() {
		console.log('Connecting servers...');

		this.#io.of('/').adapter.on('delete-room', (room) => {
			console.log(`Room ${room} was deleted`);
		});

		this.#io.on('connection', (socket) => {
			console.log('Connected servers');

			socket.on('fetchAvailableGames', () => {
				socket.emit('updateAvailableGames', this.#gamesManager.getPublicGameList());
			});

			socket.on('createGame', (hostId, playerName, settings) => {
				try {
					this.#gamesManager.createGame(socket, hostId, settings);

					const gameId = hostId;

					socket.emit('createGameSuccess', gameId);

					this.joinGame(socket, gameId, hostId, playerName, {x: 100, y: 100});
				} catch (error) {
					console.log(error.message);
					socket.emit('error', error.message);
				}
			});

			socket.on('joinGame', (gameId, playerName) => {
				const playerId = socket.id;
				const game = this.#serverStore.games.get(gameId);
				let playerPos;
				if (game.playersInLobby === 1) {
					playerPos = {x: 1700, y: 900};
				} else if (game.playersInLobby === 2) {
					playerPos = {x: 100, y: 900};
				} else if (game.playersInLobby === 3) {
					playerPos = {x: 1700, y: 100};
				}
				game.playersInLobby += 1;

				this.joinGame(socket, gameId, playerId, playerName, playerPos);
			});

			socket.on('disconnect', () => {
				const playerId = socket.id;
				const gameId = socket.gameId;
				if (!gameId) return;

				const game = this.#serverStore.games.get(gameId);
				if (!game) return;

				const players = game.state.players;

				if (players[playerId]) {
					console.log('Disconnecting player: ', playerId);
					delete players[playerId];
					socket.to(gameId).emit('playerLeft', playerId);
				}
				if (Object.keys(players).length === 0) {
					console.log('Deleting game: ', gameId);
					this.#serverStore.games.delete(gameId);
				}

				if (!game.settings.private) {
					this.#io.emit('updateAvailableGames', this.#gamesManager.getPublicGameList());
				}
			});
		});
	}

	// todo refactor this monstrum as well
	joinGame(socket, gameId, playerId, playerName, spawnPos) {
		socket.join(gameId);
		socket.gameId = gameId;

		const player = new Player(playerId, playerName, container.resolve('playerService'), spawnPos);

		try {
			this.#gameService.addPlayerToGame(gameId, playerId, player);
			socket.emit('joinGameSuccess', gameId, this.#serverStore.games.get(gameId).state,
				this.#serverStore.games.get(gameId).settings, playerId);


			socket.to(gameId).emit('playerJoined', playerId, playerName);

			console.log('Player: ', playerId, ' joined game: ', gameId);
		} catch (error) {
			console.error(error.message);
			socket.emit('error', error.message);
		}

		const game = this.#serverStore.games.get(gameId);
		const gameState = game.state;

		this.#io.to(gameId).emit('myPlayerCreated', gameState.players[playerId], playerId);

		socket.on('updateMyPlayerInput', (data) => {
			let {key, type, shootingAngle} = data;
			const player = gameState.players[playerId];

			if (!player) {
				console.error('Player not found: ', playerId);
				return;
			}
			const input = player.input;
			if (key === 'w') {
				key = 'ArrowUp';
			} else if (key === 's') {
				key = 'ArrowDown';
			} else if (key === 'a') {
				key = 'ArrowLeft';
			} else if (key === 'd') {
				key = 'ArrowRight';
			}

			if (type === 'mouseclick') {
				player.shootingAngle = shootingAngle;

				if (key === ' ') {
					input.space = true;

					setTimeout(() => {
						input.space = false;
					}, 100);
				}

				return;
			}

			type === 'keydown' ? input[key] = true : input[key] = false;
		});

		socket.on('gameStatusChange', (gameId, status, playerId = null) => {
			if (!this.#serverStore.games.has(gameId)) return;

			try {
				this.#gameService.updateGameStatus(gameId, status, playerId, this.io);
			} catch (error) {
				console.error(error.message);
				socket.emit('error', error.message);
			}

			this.#io.to(gameId).emit('gameStatusChangeSuccess', gameId, game.state.status, playerId);
			this.#io.emit('updateAvailableGames', this.#gamesManager.getPublicGameList());

			if (status === 'finished') {
				this.removeListeners(socket);
				this.leaveSocketRoom(socket, gameId);
			}
		});

		socket.on('leaveGame', (gameId, playerId) => {
			const game = this.#serverStore.games.get(gameId);

			const removed = this.#gameService.removePlayer(game, playerId);

			if (!removed) {
				console.warn(`Tried to remove player ${playerId}, but they were not in game ${gameId}`);
				return;
			}

			this.#io.to(gameId).emit('playerLeft', playerId);

			this.leaveSocketRoom(socket, gameId);
			this.removeListeners(socket);

			if (Object.keys(game.state.players).length === 0) {
				this.#serverStore.games.delete(gameId);
				console.log(`Game ${gameId} deleted because no players left`);
				this.#io.emit('updateAvailableGames', this.#gamesManager.getPublicGameList());
			}
		});

		if (!game.settings.private) {
			this.#io.emit('updateAvailableGames', this.#gamesManager.getPublicGameList());
		}
	}

	leaveSocketRoom(socket, gameId) {
		console.log('leaving socket room');
		socket.leave(gameId);
	}

	removeListeners(socket) {
		console.log('removing listeners');
		socket.removeAllListeners('updateMyPlayerInput');
		socket.removeAllListeners('gameStatusChange');
		socket.removeAllListeners('leaveGame');
	}
}
