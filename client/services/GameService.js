
export class GameService {

	#clientManager;

	constructor(playerInputService) {
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

		bullet.getPosition.y = newBulletData.getPosition.y;
		bullet.getPosition.x = newBulletData.getPosition.x;

		bullet.getElement.style.top = `${bullet.getPosition.y}px`
		bullet.getElement.style.left = `${bullet.getPosition.x}px`
	}



	createBulletModel(bulletData, bulletId) {
		if (document.getElementById(bulletId) !== null) {
			console.log("Bullet already exists!");
			return;
		}

		const bullet = this.#clientManager.game.state.bullets[bulletId];

		bullet.getPosition.x = bulletData.pos.x;
		bullet.getPosition.y = bulletData.pos.y;

		const bulletElement = document.createElement("div")
		bulletElement.classList.add("bullet")
		bulletElement.id = `${bullet.getId}`
		bulletElement.style.top = `${bullet.getPosition.y}px`
		bulletElement.style.left = `${bullet.getPosition.x}px`
		bulletElement.tabIndex = 0;

		for (const property in bullet.styles) {
			bulletElement.style[property] = bullet.styles[property]
		}

		bullet.setElement(bulletElement);

		const gameField = document.getElementById("game-field");

		gameField.appendChild(bulletElement);
	}

	// updateSettings(updatedSettings) {
	// 	this.#settings = {...this.#settings, ...updatedSettings};
	// }
	//
	// updateState(updatedState) {
	// 	this.#state = {...this.#state, ...updatedState};
	// }

	// setClientManager(clientManager) {
	// 	this.#clientManager = clientManager;
	// }
	//
	// createGame(hostId, settings) {
	// 	return new Game(hostId, settings);
	// }
	//
	// updateGameState(game) {
	//
	// 	// handle bullet input
	// 	this.bulletInputService.handlePlayerMovement(game);
	//
	// }
}
