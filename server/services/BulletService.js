import Bullet from '../models/Bullet.js';

export class BulletService {
	#serverStore;
	#gameService;
	#lastUpdateTime = 0;

	constructor({serverStore}) {
		this.#serverStore = serverStore;
	}

	setGameService(gameService) {
		this.#gameService = gameService;
	}

	createBulletAt(x, y, angle, game, playerWidth, damageMultiplier) {
		// TODO: add UUID generation instead of math.random
		const id = Math.floor(Math.random() * 10000);
		const offset = 24;
		const playerCenterX = x + playerWidth / 2;
		const playerCenterY = y + playerWidth / 2;
		const bulletX = playerCenterX + Math.cos(angle) * offset;
		const bulletY = playerCenterY + Math.sin(angle) * offset
		const directionVector = {
			x: Math.cos(angle),
			y: Math.sin(angle)
		};

		game.state.bullets[id] = new Bullet(id, bulletX, bulletY, directionVector, damageMultiplier, angle);
	}

	updateBullets(game) {
		const bullets = game.state.bullets;
		const bulletsToDelete = [];
		const currentTime = Date.now();

		// use time for frame rate independence for smooth animations
		const deltaTime = (currentTime - this.#lastUpdateTime) / 1000;
		this.#lastUpdateTime = currentTime;

		// guard if fps drops too low
		const cappedDeltaTime = Math.min(deltaTime, 0.016);

		Object.entries(bullets).forEach(([bulletId, bullet]) => {
			const bulletSize = bullet.size?.width || 20;
			const startX = bullet.pos.x;
			const startY = bullet.pos.y;

			const movementDistance = bullet.velocityPerSecond * cappedDeltaTime;
			const newX = bullet.pos.x + movementDistance * bullet.direction.x;
			const newY = bullet.pos.y + movementDistance * bullet.direction.y;
			const didBulletHit = this.#gameService.raycastToWalls(startX, startY, newX, newY, bulletSize, game)

			if (didBulletHit || this.isOutOfBounds({x: newX, y: newY})) {
				const closestPosition = this.findClosestPositionToWall(bullet, newX, newY, bulletSize, game);
				this.moveBulletByVelocity(bullet, closestPosition.x, closestPosition.y);
				bulletsToDelete.push(bulletId);
			} else {
				this.moveBulletByVelocity(bullet, newX, newY);
			}
		});

		this.deleteBullets(bulletsToDelete, bullets);
	}

	findClosestPositionToWall(bullet, newX, newY, bulletSize, game) {
		const startX = bullet.pos.x;
		const startY = bullet.pos.y;

		const deltaX = newX - startX;
		const deltaY = newY - startY;
		const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

		if (totalDistance === 0) {
			return { x: startX, y: startY };
		}

		let minDistance = 0;
		let maxDistance = totalDistance;

		for (let i = 0; i < 10; i++) {
			const testDistance = (minDistance + maxDistance) / 2;
			const progress = testDistance / totalDistance;

			const testX = startX + deltaX * progress;
			const testY = startY + deltaY * progress;

			if (this.#gameService.wouldCollideWithWalls(testX, testY, bulletSize, game)) {
				maxDistance = testDistance;
			} else {
				minDistance = testDistance;
			}
		}

		const safeToTravel = minDistance / totalDistance;
		return {
			x: startX + deltaX * safeToTravel,
			y: startY + deltaY * safeToTravel
		};
	}

	moveBulletByVelocity(bullet, newX, newY) {
		bullet.pos.x = newX;
		bullet.pos.y = newY;
	}

	deleteBullets(bulletsToDelete, bullets) {
		bulletsToDelete.forEach(bulletId => {
			delete bullets[bulletId];
		});
	}

	isOutOfBounds(pos) {
		const { MIN_X, MAX_X, MIN_Y, MAX_Y } = this.#serverStore.GAME_BOUNDS;
		return pos.y < MIN_Y || pos.y > MAX_Y || pos.x < MIN_X || pos.x > MAX_X;
	}
}
