export default class GameInterface {
	#gameId = null;
	#playerCount = null;
	// #idElement
	// #playerCountElement

	constructor() {
	}

	get gameId() {
		return this.#gameId;
	}

	set gameId(gameId) {
		this.#gameId = gameId;
	}

	get playerCount() {
		return this.#playerCount;
	}

	set playerCount(playerCount) {
		this.#playerCount = playerCount;
	}

	// setIdElement(idElement) {
	// 	this.#idElement = idElement;
	// }
	//
	// setPlayerCountElement(playerCountElement) {
	// 	this.#playerCountElement = playerCountElement;
	// }

 }