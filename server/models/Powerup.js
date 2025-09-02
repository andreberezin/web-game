export default class Powerup {
	id = null;
	pos = {
		x: 0,
		y: 0
	};
	size = {
		width: 20,
		height: 20
	};
	typeOfPowerup = 0;
	timeOfCreation = 0;


	constructor(id, x, y, typeOfPowerup, timeOfCreation) {
		this.id = id;

		this.pos = {
			x: x - this.size.width / 2,
			y: y - this.size.height / 2
		};

		this.typeOfPowerup = typeOfPowerup;
		this.timeOfCreation = timeOfCreation;
	}

	givePowerup(player, currentTime) {
		if (this.typeOfPowerup === 0) {
			if (player.lives < 5) {
				player.lives += 1;
				player.score += 1;
			}
		} else if (this.typeOfPowerup === 1) {
			player.damageMultiplier = 2;
			player.damageBoostEndTime = currentTime + 7000;
		}
	}
}
