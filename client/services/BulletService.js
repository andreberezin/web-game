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
}