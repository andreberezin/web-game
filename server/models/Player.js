export class Player {
	pos = {
		x: 100,
		y: 100,
	};
    id = "player-1";
    name = null;
    shift = null;
    maxPosition = {
        x: 0,
        y: 0,
    }
    input = {
        arrowUp: false,
        arrowDown: false,
        arrowRight: false,
        arrowLeft: false,
        space: false
    }
    direction = up;

	constructor(id) {
		// this.#pos = pos;
        this.id = id
	}

    get getPosition() {
        return this.pos;
    }

    get getShift() {
        return this.shift;
    }

    get getMaxPosition() {
        return this.maxPosition;
    }

    setShift(data) {
        this.shift = data;
    }

    setPosition(pos) {
        this.pos = pos;
    }
}
