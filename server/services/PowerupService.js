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

	createPowerup(game, currentTime) {
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
		game.state.powerups[id] = new Powerup(id, x, y, typeOfPowerup, currentTime);
	}

	updatePlayerPowerups(player, currentTime) {
		if (player.damageBoostEndTime && currentTime >= player.damageBoostEndTime) {
			player.damageMultiplier = 1;
			player.damageBoostEndTime = null;
			console.log("Damage multiplier reset for player: ", player.damageMultiplier);
		}
	}

	updatePowerups(game, currentTime) {
		const timeWhenLastPowerupWasCreated = this.#serverStore.timeWhenLastPowerupWasCreated;
		let currentAmountOfPowerups = Object.keys(game.state.powerups).length;
		const powerupsToDelete = [];
		const powerups = game.state.powerups;

		//console.log(currentTime - timeWhenLastPowerupWasCreated);
		if (currentAmountOfPowerups <= 5 && ((currentTime - timeWhenLastPowerupWasCreated) > 5000 || timeWhenLastPowerupWasCreated === 0)) {
			this.createPowerup(game, currentTime);
			this.#serverStore.timeWhenLastPowerupWasCreated = currentTime;
		}

		for(const powerupID in game.state.powerups) {
			const powerup = game.state.powerups[powerupID];

			if((currentTime - powerup.timeOfCreation) > 25000) {
				powerupsToDelete.push(powerupID);
			}
		}

		this.deletePowerups(powerupsToDelete, powerups);
	}

	deletePowerups(powerupsToDelete, powerups) {
		powerupsToDelete.forEach(powerupID => {
			delete powerups[powerupID];
		});
	}
}
