export default class Player {
    // todo make fields private and use setters, getters? Needs extra logic to send data via sockets if fields are private
    // todo restructure data into fewer objects with related values to make more sense
    id = null;

    name = null;
    shift = 0;
    maxPos = {
        x: 1920 - 30,
        y: 1080 - 30,
    }
    pos = {
        x: 0,
        y: 0,
    };
    spawnPos = {
        x: 100,
        y: 100,
    }
    size = {
        width: 30,
        height: 30,
    }
    input = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowRight: false,
        ArrowLeft: false,
        space: false
    }
    direction = "up";
    lastShotTime = 0;
    shotCooldown = 250;
    hp = 100;
    lives = 3;
    speed = 5;
    maxSpeed = 1;
    acceleration = 1000 // in ms, less is more
    movementStart = null;
    deathCooldown = 5000;
    respawnTimer = null;
    deathTime = 0;
    damageMultiplier = 1;
    damageBoostEndTime = null;
    shootingAngle = null;
    status = {
        alive: true
    };
    color = null;

    // movement = {
    //     pos: {},
    //     spawnPos: {},
    //     maxPos: {},
    //     direction: "up",
    //     shift: 0,
    //     speed: 0,
    //     maxSpeed: 0,
    //     acceleration: 1000,
    //     startTime: null,
    // }
    // shooting = {
    //     lastShotTime: 0,
    //     shotCooldown: 0,
    // }
    // death = {
    //     time: null,
    //     cooldown: 5000,
    //     timer: null,
    // }

	constructor(id, name) {
        this.id = id;
        this.name = name;
        this.pos = this.spawnPos;
	}

    // setStatus(status) {
    //     this.status = status;
    // }
    //
    // getStatus() {
    //     return this.status;
    // }

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

    get position() {
        return this.pos;
    }

    set position({x, y}) {
        this.pos = {
            x: x,
            y: y,
        }
    }

    get maxPosition() {
        return this.maxPos;
    }

    set maxPosition({ x, y }) {
        this.maxPos = {
            x: x,
            y: y,
        }
    }

    // get respawnTimer() {
    //     return this.respawnTime;
    // }
    //
    // set respawnTimer(time) {
    //     this.respawnTime = time;
    // }


    // get getShift() {
    //     return this.shift;
    // }
    //

    // setHp(hp) {
    //     this.hp = hp;
    // }
    //
    // getHp() {
    //     return this.hp;
    // }

    // setShift(data) {
    //     this.shift = data;
    // }
}
