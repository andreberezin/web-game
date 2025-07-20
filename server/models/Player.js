export class Player {
	pos = {
		x: 100,
		y: 100,
	};
    id = "player-1";
    name = null;
    shift = null;
    maxPosition = {
        x: 0,
        y: 0,
    }
    input = {
        arrowUp: false,
        arrowDown: false,
        arrowRight: false,
        arrowLeft: false,
        space: false
    }
    direction = "up";
    lastShotTime = 0;
    shotCooldown = 250;
    hp = 100;
    deathCooldown = 5000;
    deathTime = 0;
    status = alive;

	constructor(id) {
        this.id = id
	}

    setStatus(status) {
        this.status = status;
    }

    getStatus() {
        return this.status;
    }

    canRespawn(currentTime) {
        return (currentTime - this.deathTime) >= this.deathCooldown;
    }

    canShoot(currentTime) {
        return (currentTime - this.lastShotTime) >= this.shotCooldown;
    }

    diedAt(currentTime) {
        this.deathTime = currentTime;
    }

    lastBulletShotAt(currentTime) {
        this.lastShotTime = currentTime;
    }

    get getPosition() {
        return this.pos;
    }

    get getShift() {
        return this.shift;
    }

    get getMaxPosition() {
        return this.maxPosition;
    }

    setHp(hp) {
        this.hp = hp;
    }

    getHp() {
        return this.hp;
    }

    setShift(data) {
        this.shift = data;
    }

    setPosition(pos) {
        this.pos = pos;
    }
}
