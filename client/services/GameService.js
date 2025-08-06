export default class GameService {
	// #clientManager;
	#clientStore;

	constructor({playerInputService, clientStore}) {
		this.playerInputService = playerInputService;
		this.#clientStore = clientStore;
	}

	// setClientManager(clientManager) {
	// 	this.#clientManager = clientManager;
	// }

	updateBulletModel(timestamp, newBulletData, bulletId) {
		let bullet = this.#clientStore.currentGame.state.bullets[bulletId];

		if (!bullet.element) return;

		this.updateElementPosition(bullet);
	}

	updateElementPosition(bullet) {
		bullet.element.style.top = `${bullet.position.y}px`
		bullet.element.style.left = `${bullet.position.x}px`
	}

	createBulletModel(bulletData, bulletId) {
		if (document.getElementById(bulletId) !== null) return;

		const bullet = this.#clientStore.currentGame.state.bullets[bulletId];

		bullet.position = bulletData.position;

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
		bulletElement.id = bullet.id;
		bulletElement.style.top = `${bullet.position.y}px`
		bulletElement.style.left = `${bullet.position.x}px`
		bulletElement.tabIndex = 0;

		// for (const property in bullet.styles) {
		// 	bulletElement.style[property] = bullet.styles[property]
		// }

		bullet.element = bulletElement;
		return bulletElement;
	}

	// setPosition(bullet, bulletData) {
	// 	console.log("bulletData:", bulletData);
	// 	bullet.position.x = bulletData.position.x;
	// 	bullet.position.y = bulletData.position.y;
	// }
}
