export default class Bullet {
	// todo make fields private and use setters, getters? Needs extra logic to send data via sockets if fields are private
	id = null;
	pos = {
		x: 0,
		y: 0
	};
	direction = null;
	angle = null;
	velocityPerSecond = 0;
	damageMultiplier = 1;
	size = {
		width: 10,
		height: 10
	};
	shooterId = null;

	constructor(id, x, y, direction, damageMultiplier, angle, shooterId) {
		this.id = id;
		this.direction = direction;
		this.velocityPerSecond = 3000;
		this.damageMultiplier = damageMultiplier;
		this.angle = angle;
		this.shooterId = shooterId;

		this.pos = {
			x: x - this.size.width / 2,
			y: y - this.size.height / 2
		};
	}
}
