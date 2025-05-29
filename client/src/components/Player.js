export class Player {
	#pos = {
		x: 0,
		y: 0,
	};
    #id = "player-1";
    #shift = null;
    start;
    #element = null;
    #maxPosition = {
        x: 0,
        y: 0,
    }
    playerInput = {
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

	attack() {

	}

    get getPosition() {
        return this.#pos;
    }

    get getShift() {
        return this.#shift;
    }

    get getMaxPosition() {
        return this.#maxPosition;
    }

    setShift(data) {
        this.#shift = data;
    }

    setPosition(pos) {
        this.#pos = pos;
    }

    #clamp(min, val, max) {
        return val > max ? max : val < min ? min : val;
    }

    update(timestamp) {

        if (this.start === undefined) {
            this.start = timestamp;
        }

        this.#maxPosition.y = window.innerHeight - this.#element.offsetHeight
        this.#maxPosition.x = window.innerWidth - this.#element.offsetWidth

        const elapsed = timestamp - this.start;
        this.#shift = Math.min(0.001 * elapsed, 10);

        // this.#pos.y = this.#clamp(0, this.#pos.y, maxPosition)
        // this.#pos.x = this.#clamp(0, this.#pos.x, maxPosition)

        // if (this.playerInput.arrowUp === true) {
        //     this.#pos.y = this.#clamp(0, this.#pos.y, maxPosition)
        // }
        // if (this.playerInput.arrowDown === true) {
        //     this.#pos.y = this.#clamp(0, this.#pos.y, maxPosition)
        // }
        // if (this.playerInput.arrowLeft === true) {
        //     this.#pos.x = this.#clamp(0, this.#pos.x,maxPosition)
        // }
        // if (this.playerInput.arrowRight === true) {
        //     this.#pos.x = this.#clamp(0, this.#pos.x, maxPosition)
        // }

        if (this.playerInput.arrowDown === false && this.playerInput.arrowUp === false && this.playerInput.arrowRight === false && this.playerInput.arrowLeft === false) {
            this.start = undefined;
        }

        this.#element.style.top = `${this.#pos.y}px`
        this.#element.style.left = `${this.#pos.x}px`
    }

    handleKeyDown(event) {
        switch(event.key) {
            case "ArrowUp": {
                this.playerInput.arrowUp = true;
                break;
            }
            case "ArrowDown": {
                this.playerInput.arrowDown = true;
                break;
            }
            case "ArrowLeft": {
                this.playerInput.arrowLeft = true;
                break;
            }
            case "ArrowRight": {
                this.playerInput.arrowRight = true;
                break;
            }
        }
    }

    handleKeyUp(event) {
        switch(event.key) {
            case "ArrowUp": {
                this.playerInput.arrowUp = false;
                break;
            }
            case "ArrowDown": {
                this.playerInput.arrowDown = false;
                break;
            }
            case "ArrowLeft": {
                this.playerInput.arrowLeft = false;
                break;
            }
            case "ArrowRight": {
                this.playerInput.arrowRight = false;
                break;
            }
        }
    }

	createPlayerModel(playerData) {

        console.log("playerData: ", playerData)

        this.#pos.x = playerData.x
        this.#pos.y = playerData.y

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
