export class Bullet {
    pos = {
        x: 100,
        y: 100,
    };
    direction = "up";
    velocity = 100;

    constructor(x, y, direction) {
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
}
