export default class Bullet {
    // todo make fields private and use setters, getters? Needs extra logic to send data via sockets if fields are private
    id = "bullet-1";
    position = {
        x: 100,
        y: 100,
    };
    direction = "up";
    velocity = 10;

    constructor(id, x, y, direction) {
        this.id = id;
        this.position.x = x;
        this.position.y = y;
        this.direction = direction;
    }

    // get id() {
    //     return this.#id;
    // }
    //
    // set id(id) {
    //     this.#id = id;
    // }
    //
    // get position() {
    //     return this.#pos;
    // }
    //
    // set position(pos) {
    //     this.#pos = pos;
    // }
}
