export class Player {
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
        x: 0,
        y: 0,
    }
    input = {
        arrowUp: false,
        arrowDown: false,
        arrowRight: false,
        arrowLeft: false,
    }
    styles = {
        width: "20px",
        height: "20px",
    }

	constructor(id) {
		// this.#pos = pos;
        this.#id = id
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
