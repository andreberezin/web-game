export default class Powerup {
    id = null;
    pos = {
        x: 0,
        y: 0,
    };
    size = {
        width: 20,
        height: 20,
    }
    typeOfPowerup = 0;

    constructor(id, x, y, typeOfPowerup) {
        this.id = id;
        this.typeOfPowerup = typeOfPowerup;

        this.pos = {
            x: x - this.size.width / 2,
            y: y - this.size.height / 2,
        };
    }
}
