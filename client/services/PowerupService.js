export class PowerupService {
	#clientStore
	#gameFieldService

	constructor({clientStore, gameFieldService}) {
		this.#clientStore = clientStore;
		this.#gameFieldService = gameFieldService;

	}

	createPowerupModel(powerupData, powerupId) {
		if (document.getElementById(powerupId) !== null) return;

		const store  = this.#clientStore;

		const powerup = store.games.get(store.gameId).state.powerups[powerupId];

		powerup.pos = powerupData.pos;

		const powerupElement = this.createElementForPowerup(powerup);
		this.#gameFieldService.appendToGameField(powerupElement);
	}

	createElementForPowerup(powerup) {
		const powerupElement = document.createElement("div")
		powerupElement.classList.add("powerup")
		powerupElement.id = powerup.id;
		powerupElement.style.top = `${powerup.pos.y}px`
		powerupElement.style.left = `${powerup.pos.x}px`
		powerupElement.tabIndex = 0;

		const imagePath = this.getPowerupImagePath(powerup.typeOfPowerup);
		powerupElement.style.backgroundImage = `url('${imagePath}')`;
		powerupElement.style.backgroundSize = 'contain';
		powerupElement.style.backgroundRepeat = 'no-repeat';
		powerupElement.style.backgroundPosition = 'center';

		powerup.element = powerupElement;
		return powerupElement;
	}

	getPowerupImagePath(typeOfPowerup) {
		switch (typeOfPowerup) {
			case 0: return '/images/heart.png';
			case 1: return '/images/damage.png';
		}
	}
}
