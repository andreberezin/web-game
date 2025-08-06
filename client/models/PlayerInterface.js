export default class PlayerInterface {
	#playerId = null;

	constructor(id) {
		this.#playerId = id;
	}

	get playerId() {
		return this.#playerId;
	}

	set playerId(playerId) {
		this.#playerId = playerId;
	}
}