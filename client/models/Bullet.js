export default class Bullet {
    pos = {
        x: 100,
        y: 100,
    };
    id = "bullet-1";
    direction = "up";
    velocity = 100;
    #element = null;

    styles = {
        width: "5px",
        height: "5px",
    }

    constructor(id, x, y, direction) {
        this.id = id;
        this.pos.x = x;
        this.pos.y = y;
        this.direction = direction;
    }

    get getPosition() {
        return this.pos;
    }

    setPosition(pos) {
        this.pos = pos;
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    get getElement() {
        return this.#element;
    }

    setElement(element) {
        this.#element = element;
    }
}
