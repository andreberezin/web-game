export class Bullet {
    pos = {
        x: 100,
        y: 100,
    };
    id = "bullet-1";
    direction = "up";
    velocity = 2;

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
}
