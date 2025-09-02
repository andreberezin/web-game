import {clamp} from '../utils/clamp.js';

export default class PlayerInputService {
	#gameService;
	#bulletService;

	constructor({bulletService}) {
		this.#bulletService = bulletService;
	}

	setGameService(gameService) {
		this.#gameService = gameService;
	}

	handlePlayerMovement(player, game) {
		if (!player.input) return;

		const input = player.input;
		const now = Date.now();

		if (!player.movementStart && (input.ArrowUp || input.ArrowDown || input.ArrowLeft || input.ArrowRight)) {
			player.movementStart = now;
		}

		if (
			!input.ArrowUp &&
			!input.ArrowDown &&
			!input.ArrowLeft &&
			!input.ArrowRight
		) {
			player.movementStart = null;
			player.shift = 0;
			return;
		}

		if (player.movementStart) {
			const elapsed = now - player.movementStart;
			const progress = Math.min(elapsed / player.acceleration, player.maxSpeed);
			const base = 0.7;
			player.shift = (base + (1 - base) * Math.pow(progress, 1.5));
		}

		const speed = player.speed;

		if (input.ArrowUp) {
			this.movePlayer(player, 'y', -speed, 'up', game);
		}
		if (input.ArrowDown) {
			this.movePlayer(player, 'y', speed, 'down', game);
		}
		if (input.ArrowLeft) {
			this.movePlayer(player, 'x', -speed, 'left', game);
		}
		if (input.ArrowRight) {
			this.movePlayer(player, 'x', speed, 'right', game);
		}
	}

	movePlayer(player, axis, speed, direction, game) {
		const distance = speed * player.shift;
		const newPosition = player.pos[axis] + distance;

		const playerSize = player.size?.width || 20;

		let testX = player.pos.x;
		let testY = player.pos.y;

		if (axis === 'x') {
			testX = newPosition;
		} else {
			testY = newPosition;
		}

		if (!this.#gameService.wouldCollideWithWalls(testX, testY, playerSize, game, 'player')) {
			player.pos[axis] = clamp(0, newPosition, player.maxPosition[axis]);
			player.direction = direction;
			return;
		}

		const maxSafeDistance = this.findMaxMovementDistance(player, axis, distance, playerSize, game);

		if (Math.abs(maxSafeDistance) > 0.1) {
			player.pos[axis] += maxSafeDistance;
			player.direction = direction;
		}
	}

	findMaxMovementDistance(player, axis, requestedDistance, playerSize, game) {
		let minDistance = 0;
		let maxDistance = Math.abs(requestedDistance);
		const direction = requestedDistance < 0 ? -1 : 1;

		for (let i = 0; i < 10; i++) {
			const testDistance = (minDistance + maxDistance) / 2;

			let testX = player.pos.x;
			let testY = player.pos.y;

			if (axis === 'x') {
				testX = player.pos.x + (testDistance * direction);
			} else {
				testY = player.pos.y + (testDistance * direction);
			}

			if (this.#gameService.wouldCollideWithWalls(testX, testY, playerSize, game, 'player')) {
				maxDistance = testDistance;
			} else {
				minDistance = testDistance;
			}
		}

		return minDistance * direction;
	}

	handlePlayerRespawning({deadPlayers, players}, currentTime) {

		for (let playerID in deadPlayers) {
			const player = players[playerID];

			if (player.lives > 0 && player.canRespawn(currentTime)) {
				player.hp = 100;
				player.status.alive = true;
				const possibleSpawns = [{x: 100, y: 100}, {x: 100, y: 900}, {x: 1700, y: 100}, {x: 1700, y: 900}];
				const randomNumber = Math.floor(Math.random() * possibleSpawns.length);
				player.pos = possibleSpawns[randomNumber];

				delete deadPlayers[playerID];
			}
		}
	}

	handlePlayerRespawnTimer(player, currentTime) {
		if (!player.status.alive) {
			player.respawnTimer = Math.max(0, player.deathCooldown - (currentTime - player.deathTime));
		} else {
			player.respawnTimer = null;
		}
	}

	handlePlayerShooting(player, currentTime, game) {
		if (player.input && player.input.space === true && player.status.alive) {
			if (player.canShoot(currentTime)) {
				if (player.shootingAngle !== undefined) {
					this.#bulletService.createBulletAt(
						player.pos.x,
						player.pos.y,
						player.shootingAngle,
						game,
						player.size.width,
						player.damageMultiplier,
						player.id
					);
				}
				player.lastBulletShotAt(currentTime);
			}
		}
	}
}

