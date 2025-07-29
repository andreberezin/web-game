export default class Bullet {
    #id = "bullet-1";
    #pos = {
        x: 100,
        y: 100,
    };
    #direction = "up";
    #velocity = 100;
    #element = null;

    // styles = {
    //     width: "5px",
    //     height: "5px",
    // }

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

    get position() {
        return this.#pos;
    }

    set position({ x, y }) {
        this.#pos = { x, y };
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
