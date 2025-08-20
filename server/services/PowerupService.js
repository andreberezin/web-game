import Powerup from '../models/Powerup.js';

export class PowerupService {
	#serverStore
	#gameService

	constructor({serverStore}) {
		this.#serverStore = serverStore;
	}

	setGameService(gameService) {
		this.#gameService = gameService;
	}

	createPowerup(game) {
		// TODO: add UUID generation instead of math.random
		const id = Math.floor(Math.random() * 10000);
		let x = Math.floor(Math.random() * 1919);
		let y = Math.floor(Math.random() * 1079);
		const typeOfPowerup = Math.floor(Math.random() * 2);
		let foundCoordinatesNotInsideWalls = false;
		while (foundCoordinatesNotInsideWalls === false) {
			if (this.#gameService.wouldCollideWithWalls(x, y, 20, game)) {
				x = Math.floor(Math.random() * 1919);
				y = Math.floor(Math.random() * 1079);
			} else {
				foundCoordinatesNotInsideWalls = true;
			}
		}
		game.state.powerups[id] = new Powerup(id, x, y, typeOfPowerup);
	}

	updatePowerups(game, currentTime) {
		const timeWhenLastPowerupWasCreated = this.#serverStore.timeWhenLastPowerupWasCreated;
		let currentAmountOfPowerups = Object.keys(game.state.powerups).length;

		//console.log(currentTime - timeWhenLastPowerupWasCreated);
		if (currentAmountOfPowerups <= 5 && ((currentTime - timeWhenLastPowerupWasCreated) > 5000 || timeWhenLastPowerupWasCreated === 0)) {
			this.createPowerup(game);
			this.#serverStore.timeWhenLastPowerupWasCreated = currentTime;
		}
	}
}