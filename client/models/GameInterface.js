export default class GameInterface {
	#gameId = null;
	#playerCount = null;
	// #idElement
	// #playerCountElement

	constructor() {
	}

	get getGameId() {
		return this.#gameId;
	}

	setGameId(gameId) {
		this.#gameId = gameId;
	}

	get getPlayerCount() {
		return this.#playerCount;
	}

	setPlayerCount(playerCount) {
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