export default class Player {
	#pos = {
		x: 0,
		y: 0,
	};
    #id = "player-1";
    #name = null;
    #shift = null;
    start;
    #element = null;
    #maxPosition = {
        x: 1920 - 30,
        y: 1080 - 30,
    }
    #size = {
        width: 0,
        height: 0,
    }
    input = {
        arrowUp: false,
        arrowDown: false,
        arrowRight: false,
        arrowLeft: false,
        space: false
    }
    hp = 100;
    // styles = {
    //     width: "20px",
    //     height: "20px",
    // }

	constructor(id) {
		// this.#pos = pos;
        this.#id = id
	}

    setHp(hp) {
        this.hp = hp;
    }

    get getHp() {
        return this.hp;
    }

    get getId() {
        return this.#id;
    }

    get getPosition() {
        return this.#pos;
    }

    get getShift() {
        return this.#shift;
    }

    get getElement() {
        return this.#element;
    }

    setElement(element) {
        this.#element = element;
    }

    get getMaxPosition() {
        return this.#maxPosition;
    }

    setMaxPosition({ x, y }) {
        this.#maxPosition = {
            x: x,
            y: y,
        }
    }

    get getSize() {
        return this.#size;
    }

    setSize({ width, height }) {
        this.#size = {
            width: width,
            height: height,
        }
    }

    setName(name) {
        this.#name = name;
    }

    setShift(data) {
        this.#shift = data;
    }

    setPosition(pos) {
        this.#pos = pos;
    }
}
