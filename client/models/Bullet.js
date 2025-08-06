export default class Bullet {
    #id = null;
    #pos = {
        x: 0,
        y: 0,
    };
    #direction = "";
    #velocity = 0;
    #element = null;

    constructor(id, x, y, direction) {
        this.#id = id;
        this.#pos.x = x;
        this.#pos.y = y;
        this.#direction = direction;
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
        console.log("position:", pos);
        this.#pos = pos;
    }

    get direction() {
        return this.#direction;
    }

    set direction(direction) {
        this.#direction = direction;
    }

    get velocity() {
        return this.#velocity;
    }

    set velocity(velocity) {
        this.#velocity = velocity;
    }

    get element() {
        return this.#element;
    }

    set element(element) {
        this.#element = element;
    }
}
