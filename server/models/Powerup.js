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

        this.pos = {
            x: x - this.size.width / 2,
            y: y - this.size.height / 2,
        };

        this.typeOfPowerup= typeOfPowerup;
    }

    givePowerup(player) {
        // Give 1 extra life to player
        if (this.typeOfPowerup === 0) {
            player.lives += 1;
            console.log("Giving extra life to player: ", player.lives);
        } else if (this.typeOfPowerup === 1) {
            player.damageMultiplier = 2;
            console.log("Raising damage for player: ", player.damageMultiplier);
        }
    }
}
