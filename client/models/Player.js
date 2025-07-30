export default class Player {

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
    direction = null;
    #hp = 0;
    // lastShotTime = 0;
    // shotCooldown = 250;
    #deathCooldown = 0;
    #respawnTime = null;
    // deathTime = 0;
    #status = {
        alive: true,
    };

	constructor(id) {
        this.#id = id
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

    get position() {
        return this.#pos;
    }

    set position({x, y}) {
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

    get maxPosition() {
        return this.#maxPos;
    }

    set maxPosition({ x, y }) {
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
}
