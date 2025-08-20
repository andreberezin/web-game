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

	createBulletAt(x, y, direction, game, playerWidth, damageMultiplier) {
		// TODO: add UUID generation instead of math.random
		const id = Math.floor(Math.random() * 10000);
		const offset = 24;


		let bulletX = x + playerWidth / 2;
		let bulletY = y + playerWidth / 2;

		switch(direction) {
		case "up":
			bulletY -= offset;
			break;
		case "down":
			bulletY += offset;
			break;
		case "left":
			bulletX -= offset;
			break;
		case "right":
			bulletX += offset;
			break;
		}
		game.state.bullets[id] = new Bullet(id, bulletX, bulletY, direction, damageMultiplier);
	}

	updateBullets(game) {
		const bullets = game.state.bullets;
		const directionMap = {
			"up": {coord: "y", multiplier: -1},
			"down": {coord: "y", multiplier: 1},
			"left": {coord: "x", multiplier: -1},
			"right": {coord: "x", multiplier: 1}
		}
		const bulletsToDelete = [];

		Object.entries(bullets).forEach(([bulletId, bullet]) => {
			const directionValues = directionMap[bullet.direction];
			const bulletSize = bullet.size?.width || 20;
			const newPosition = bullet.pos[directionValues.coord] + bullet.velocity * directionValues.multiplier;
			let testX = bullet.pos.x;
			let testY = bullet.pos.y;

			if (directionMap[bullet.direction].coord === 'x') {
				testX = newPosition;
			} else {
				testY = newPosition;
			}

			this.moveBulletByVelocity(bullet, directionValues);

			if (this.#gameService.wouldCollideWithWalls(testX, testY, bulletSize, game) || this.isOutOfBounds(bullet.pos)) {
				bulletsToDelete.push(bulletId);
			}
		});

		this.deleteBullets(bulletsToDelete, bullets);
	}

	moveBulletByVelocity(bullet, directionValues) {
		if (directionValues) {
			bullet.pos[directionValues.coord] += bullet.velocity * directionValues.multiplier;
		}
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