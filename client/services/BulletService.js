import {existingUI} from '../utils/existingUI.js';

export class BulletService {
	#clientStore
	#gameFieldService

	constructor({clientStore, gameFieldService}) {
		this.#clientStore = clientStore;
		this.#gameFieldService = gameFieldService;

	}

	createBulletModel(bulletData, bulletId) {
		// if (document.getElementById(bulletId) !== null) return;
		if (existingUI(bulletId)) return;

		const store  = this.#clientStore;

		const bullet = store.games.get(store.gameId).state.bullets[bulletId];

		bullet.pos = bulletData.pos;

		const bulletElement = this.createElementForBullet(bullet);
		this.#gameFieldService.appendToGameField(bulletElement);
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
}