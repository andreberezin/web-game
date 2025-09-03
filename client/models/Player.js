export default class Player {
    // todo restructure data into fewer objects with related values to make more sense
    #id = null;
    #name = null;
    #shift = null;
    #element = null;
    #pos = {
        x: 0,
        y: 0,
    };
    #start = null;
    #maxPos = {
        x: 0,
        y: 0,
    }
    // #spawnPos = {
    //     x: 100,
    //     y: 100,
    // }
    #size = {
        width: 0,
        height: 0,
    }
    #input = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowRight: false,
        ArrowLeft: false,
        space: false
    }
    #direction = null;
    #hp = 0;
    #kills = 0;
    #lives = 3;
    #score = 0;
    #shootingAngle = null;
    // lastShotTime = 0;
    // shotCooldown = 250;
    #deathCooldown = 0;
    #respawnTime = null;
    // deathTime = 0;
    #status = {
        alive: true,
    };
    #pauses = 2;
    #colorIndex

	constructor(id, name, colorIndex) {
        this.#id = id;
        this.#name = name;
        this.#colorIndex = colorIndex;
	}

    get colorIndex() {
        return this.#colorIndex;
    }

    set colorIndex(colorIndex) {
        this.#colorIndex = colorIndex;
    }

    get id() {
        return this.#id;
    }


    get input() {
        return this.#input;
    }

    set input(input) {
        this.#input = input;
    }

    get hp() {
        return this.#hp;
    }

    set hp(hp) {
        this.#hp = hp;
    }

    get kills() {
        return this.#kills;
    }

    set kills(kills) {
        this.#kills = kills;
    }

    get lives() {
        return this.#lives;
    }

    set lives(lives) {
        this.#lives = lives;
    }

    get score() {
        return this.#score;
    }

    set score(score) {
        this.#score = score;
    }

    get shootingAngle() {
        return this.#shootingAngle;
    }

    set shootingAngle(shootingAngle) {
        this.#shootingAngle = shootingAngle;
    }

    get pos() {
        return this.#pos;
    }

    set pos({x, y}) {
        this.#pos = {
            x: x,
            y: y,
        }
    }

    get shift() {
        return this.#shift;
    }

    set shift(data) {
        this.#shift = data;
    }

    get element() {
        return this.#element;
    }

    set element(element) {
        this.#element = element;
    }

    get maxPos() {
        return this.#maxPos;
    }

    set maxPos({ x, y }) {
        this.#maxPos = {
            x: x,
            y: y,
        }
    }

    get size() {
        return this.#size;
    }

    set size({ width, height }) {
        this.#size = {
            width: width,
            height: height,
        }
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        this.#name = name;
    }

    get start() {
        return this.#start;
    }

    set start(timestamp) {
        this.#start = timestamp;
    }

    get status() {
        return this.#status;
    }

    set status(status) {
        this.#status = status;
    }

    get deathCooldown() {
        return this.#deathCooldown;
    }

    set deathCooldown(cooldown) {
        this.#deathCooldown = cooldown;
    }

    get respawnTimer() {
        return this.#respawnTime;
    }

    set respawnTimer(time) {
        this.#respawnTime = time;
    }

    get direction() {
        return this.#direction;
    }

    set direction(direction) {
        this.#direction = direction;
    }

    get pauses() {
        return this.#pauses;
    }

    set pauses(pauses) {
        this.#pauses = pauses;
    }
}
