import {existingUI} from '../utils/existingUI.js';

export default class GameService {
	#clientStore;
	#bulletService

	constructor({clientStore, bulletService}) {
		this.#clientStore = clientStore;
		this.#bulletService = bulletService;
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

	createBulletModel(bulletData, bulletId) {
		// if (document.getElementById(bulletId) !== null) return;
		if (existingUI(bulletId)) return;

		const store  = this.#clientStore;

		const bullet = store.games.get(store.gameId).state.bullets[bulletId];

		bullet.pos = bulletData.pos;

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
		bulletElement.style.top = `${bullet.pos.y}px`
		bulletElement.style.left = `${bullet.pos.x}px`
		bulletElement.tabIndex = 0;

		// for (const property in bullet.styles) {
		// 	bulletElement.style[property] = bullet.styles[property]
		// }

		bullet.element = bulletElement;
		return bulletElement;
	}

	handleGameStart() {

	}

	updateGameState() {

	}

	handleGamePause() {

	}


	handleGameEnd(gameId) {
		const game = this.#clientStore.games.get(gameId);

		this.#bulletService.removeBullets(game.state.bullets);
	}

	// setPosition(bullet, bulletData) {
	// 	console.log("bulletData:", bulletData);
	// 	bullet.position.x = bulletData.position.x;
	// 	bullet.position.y = bulletData.position.y;
	// }
}
