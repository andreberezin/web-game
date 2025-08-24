export default class Bullet {
    #id = null;
    #pos = {
        x: 0,
        y: 0,
    };
    #direction = null;
    #angle = null;
    #velocityPerSecond = 0;
    #element = null;

    constructor(id, x, y, direction, angle) {
        this.#id = id;
        this.#pos.x = x;
        this.#pos.y = y;
        this.#direction = direction;
        this.#angle = angle;
    }

    get id() {
        return this.#id;
    }

    set id(id) {
        this.#id = id;
    }

    get pos() {
        return this.#pos;
    }

    set pos(pos) {
        this.#pos = pos;
    }

    get direction() {
        return this.#direction;
    }

    set direction(direction) {
        this.#direction = direction;
    }

    get angle() {
        return this.#angle;
    }

    set angle(angle) {
        this.#angle = angle;
    }

    get velocityPerSecond() {
        return this.#velocityPerSecond;
    }

    set velocityPerSecond(velocityPerSecond) {
        this.#velocityPerSecond = velocityPerSecond;
    }

    get element() {
        return this.#element;
    }

    set element(element) {
        this.#element = element;
    }
}
