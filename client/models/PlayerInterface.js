export default class PlayerInterface {
	#playerId = null;


	constructor() {
	}

	get getPlayerId() {
		return this.#playerId;
	}

	setGameId(playerId) {
		this.#playerId = playerId;
	}
}