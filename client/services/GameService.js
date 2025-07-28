export default class GameService {
	#clientManager;

	constructor({playerInputService}) {
		this.playerInputService = playerInputService;
	}

	setClientManager(clientManager) {
		this.#clientManager = clientManager;
	}

	updateBulletModel(timestamp, newBulletData, bulletId) {
		let bullet = this.#clientManager.game.state.bullets[bulletId];

		if (!bullet.getElement) {
			return;
		}

		this.updateElementPosition(bullet);
	}

	updateElementPosition(bullet) {
		bullet.getElement.style.top = `${bullet.getPosition.y}px`
		bullet.getElement.style.left = `${bullet.getPosition.x}px`
	}

	createBulletModel(bulletData, bulletId) {
		if (document.getElementById(bulletId) !== null) {
			console.log("Bullet already exists!");
			return;
		}

		const bullet = this.#clientManager.game.state.bullets[bulletId];

		this.setPosition(bullet, bulletData);
		const bulletElement = this.createElement(bullet);
		this.appendToGameField(bulletElement);
	}

	appendToGameField(bulletElement) {
		const gameField = document.getElementById("game-inner");
		gameField.appendChild(bulletElement);
	}

	createElement(bullet) {
		const bulletElement = document.createElement("div")
		bulletElement.classList.add("bullet")
		bulletElement.id = bullet.getId();
		bulletElement.style.top = `${bullet.getPosition.y}px`
		bulletElement.style.left = `${bullet.getPosition.x}px`
		bulletElement.tabIndex = 0;

		// for (const property in bullet.styles) {
		// 	bulletElement.style[property] = bullet.styles[property]
		// }

		bullet.setElement(bulletElement);
		return bulletElement;
	}

	setPosition(bullet, bulletData) {
		bullet.getPosition.x = bulletData.pos.x;
		bullet.getPosition.y = bulletData.pos.y;
	}
}
