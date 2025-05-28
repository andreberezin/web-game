export class Player {
	#pos = {
		x: 0,
		y: 0
	};
    #id = "player-1";
    start;
    #element = null;
    arrow = {
        up: false,
        down: false,
        right: false,
        left: false,
    }
    styles = {
        width: "20px",
        height: "20px",
    }

	constructor(pos, id) {
		this.#pos = pos;
        this.#id = id
	}

	attack() {

	}

    get position() {
        return this.#pos;
    }

    #clamp(min, val, max) {
        return val > max ? max : val < min ? min : val;
    }

    update(timestamp) {

        if (this.start === undefined) {
            this.start = timestamp;
        }

        const elapsed = timestamp - this.start;
        const shift = Math.min(0.001 * elapsed, 10);

        if (this.arrow.up === true) {
            this.#pos.y = this.#clamp(0, this.#pos.y - shift, window.innerHeight - this.#element.offsetHeight)
            // this.#pos.y = this.#pos.y - shift;
        }
        if (this.arrow.down === true) {
            this.#pos.y = this.#clamp(0, this.#pos.y + shift, window.innerHeight - this.#element.offsetHeight)
            // this.#pos.y = this.#pos.y + shift;
        }
        if (this.arrow.left === true) {
            this.#pos.x = this.#clamp(0, this.#pos.x - shift,window.innerWidth - this.#element.offsetWidth)
            // this.#pos.x = this.#pos.x - shift;
        }
        if (this.arrow.right === true) {
            this.#pos.x = this.#clamp(0, this.#pos.x + shift, window.innerWidth - this.#element.offsetWidth)
            // this.#pos.x = this.#pos.x + shift;
        }

        if (this.arrow.down === false && this.arrow.up === false && this.arrow.right === false && this.arrow.left === false) {
            this.start = undefined;
        }

        this.#element.style.top = `${this.#pos.y}px`
        this.#element.style.left = `${this.#pos.x}px`
    }

    handleKeyDown(event) {
        switch(event.key) {
            case "ArrowUp": {
                this.arrow.up = true;
                break;
            }
            case "ArrowDown": {
                this.arrow.down = true;
                break;
            }
            case "ArrowLeft": {
                this.arrow.left = true;
                break;
            }
            case "ArrowRight": {
                this.arrow.right = true;
                break;
            }
        }
    }

    handleKeyUp(event) {
        switch(event.key) {
            case "ArrowUp": {
                this.arrow.up = false;
                break;
            }
            case "ArrowDown": {
                this.arrow.down = false;
                break;
            }
            case "ArrowLeft": {
                this.arrow.left = false;
                break;
            }
            case "ArrowRight": {
                this.arrow.right = false;
                break;
            }
        }
    }

	insertPlayer() {

        if (document.getElementById(this.#id) !== null) {
            console.log("Player already exists!");
            return;
        }

        console.log("Creating player: ", this.#id);

        const player = document.createElement("div")
        player.className = "player"
        player.id = `${this.#id}`
        player.style.top = `${this.#pos.y}px`
        player.style.left = `${this.#pos.x}px`
        player.tabIndex = 0;

        for (const property in this.styles) {
            player.style[property] = this.styles[property]
        }

        player.addEventListener("keydown", (event) => {
            this.handleKeyDown(event);
        })

        player.addEventListener("keyup", (event) => {
            this.handleKeyUp(event);
        })

        this.#element = player;

        const gameField = document.getElementById("game-field");

        gameField.appendChild(player);

        player.focus();
	}
}
