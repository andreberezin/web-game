export default class Player {
	#pos = {
		x: 0,
		y: 0,
	};
    #id = null;
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
    #input = {
        arrowUp: false,
        arrowDown: false,
        arrowRight: false,
        arrowLeft: false,
        space: false
    }
    #hp = 100;

	constructor(id) {
        this.#id = id
	}

    get id() {
        return this.#id;
    }

    set input(input) {
        this.#input = input;
    }

    get input() {
        return this.#input;
    }

    set hp(hp) {
        this.#hp = hp;
    }

    get hp() {
        return this.#hp;
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
