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
		const store  = this.#clientStore;

		let bullet = store.games.get(store.gameId).state.bullets[bulletId];

		if (!bullet.element) return;

		this.updateElementPosition(bullet);
	}

	updateElementPosition(bullet) {
		bullet.element.style.top = `${bullet.pos.y}px`
		bullet.element.style.left = `${bullet.pos.x}px`
	}

	createBulletModel(bulletData, bulletId) {
		if (document.getElementById(bulletId) !== null) return;

		const store  = this.#clientStore;

		const bullet = store.games.get(store.gameId).state.bullets[bulletId];

		bullet.pos = bulletData.pos;

		const bulletElement = this.createElementForBullet(bullet);
		this.appendToGameField(bulletElement);
	}

	createPowerupModel(powerupData, powerupId) {
		if (document.getElementById(powerupId) !== null) return;

		const store  = this.#clientStore;

		const powerup = store.games.get(store.gameId).state.powerups[powerupId];

		powerup.pos = powerupData.pos;

		const powerupElement = this.createElementForPowerup(powerup);
		this.appendToGameField(powerupElement);
	}

	appendToGameField(bulletElement) {
		const gameField = document.getElementById("game-inner");
		gameField.appendChild(bulletElement);
	}

	createElementForBullet(bullet) {
		const bulletElement = document.createElement("div")
		bulletElement.classList.add("bullet")
		bulletElement.id = bullet.id;
		bulletElement.style.top = `${bullet.pos.y}px`
		bulletElement.style.left = `${bullet.pos.x}px`
		bulletElement.tabIndex = 0;

		// for (const property in bullet.styles) {
		// 	bulletElement.style[property] = bullet.styles[property]
		// }

		bullet.element = bulletElement;
		return bulletElement;
	}

	createElementForPowerup(powerup) {
		const powerupElement = document.createElement("div")
		powerupElement.classList.add("powerup")
		powerupElement.id = powerup.id;
		powerupElement.style.top = `${powerup.pos.y}px`
		powerupElement.style.left = `${powerup.pos.x}px`
		powerupElement.tabIndex = 0;

		// for (const property in powerup.styles) {
		// 	powerupElement.style[property] = powerup.styles[property]
		// }

		powerup.element = powerupElement;
		return powerupElement;
	}

	// setPosition(bullet, bulletData) {
	// 	console.log("bulletData:", bulletData);
	// 	bullet.position.x = bulletData.position.x;
	// 	bullet.position.y = bulletData.position.y;
	// }
}
