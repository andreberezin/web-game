export default class Bullet {
    // todo make fields private and use setters, getters? Needs extra logic to send data via sockets if fields are private
    id = null;
    pos = {
        x: 0,
        y: 0,
    };
    direction = null;
    velocity = 10;
    size = {
        width: 10,
        height: 10,
    }

    constructor(id, x, y, direction) {
        this.id = id;
        this.direction = direction;
        this.velocity = 10;

        // Center the bullet at the given (x, y)
        this.pos = {
            x: x - this.size.width / 2,
            y: y - this.size.height / 2,
        };
    }

    // get id() {
    //     return this.#id;
    // }
    //
    // set id(id) {
    //     this.#id = id;
    // }
    //
    // get pos() {
    //     return this.#pos;
    // }
    //
    // set pos(pos) {
    //     this.#pos = pos;
    // }
    //
    // get direction() {
    //     return this.#direction;
    // }
    //
    // set direction(direction) {
    //     this.#direction = direction;
    // }
    //
    // get velocity() {
    //     return this.#velocity;
    // }
    //
    // set velocity(velocity) {
    //     this.#velocity = velocity;
    // }
    //
    // get size() {
    //     return this.#size;
    // }

    // set size(size) {
    //     this.#size = size;
    // }
}
