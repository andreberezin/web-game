import Bullet from '../models/Bullet.js';

export class BulletService {
	#serverStore;
	#gameService;

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

		Object.entries(bullets).forEach(([bulletId, bullet]) => {
			const bulletSize = bullet.size?.width || 20;
			const startX = bullet.pos.x;
			const startY = bullet.pos.y;
			let newX = bullet.pos.x + bullet.velocity * bullet.direction.x;
			let newY = bullet.pos.y + bullet.velocity * bullet.direction.y;
			let didBulletHit = this.#gameService.raycastToWalls(startX, startY, newX, newY, bulletSize, game)

			if (didBulletHit || this.isOutOfBounds({x: newX, y: newY})) {
				bulletsToDelete.push(bulletId);
			} else {
				this.moveBulletByVelocity(bullet, newX, newY);
			}
		});

		this.deleteBullets(bulletsToDelete, bullets);
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
