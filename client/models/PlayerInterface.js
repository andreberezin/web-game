export default class PlayerInterface {
	#playerId = null;


	constructor() {
	}

	get playerId() {
		return this.#playerId;
	}

	set gameId(playerId) {
		this.#playerId = playerId;
	}
}