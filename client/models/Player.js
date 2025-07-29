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


    get input() {
        return this.#input;
    }

    set input(input) {
        this.#input = input;
    }

    get hp() {
        return this.#hp;
    }

    set hp(hp) {
        this.#hp = hp;
    }

    get position() {
        return this.#pos;
    }

    set position({x, y}) {
        this.#pos = {
            x: x,
            y: y,
        }
    }

    get shift() {
        return this.#shift;
    }

    set shift(data) {
        this.#shift = data;
    }

    get element() {
        return this.#element;
    }

    set element(element) {
        this.#element = element;
    }

    get maxPosition() {
        return this.#maxPosition;
    }

    set maxPosition({ x, y }) {
        this.#maxPosition = {
            x: x,
            y: y,
        }
    }

    get size() {
        return this.#size;
    }

    set size({ width, height }) {
        this.#size = {
            width: width,
            height: height,
        }
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        this.#name = name;
    }
}
