import {existingUI} from '../utils/existingUI.js';

export default class GameService {
	#clientStore;
	#socketHandler;
	#gameFieldService;

	constructor({clientStore, socketHandler, gameFieldService}) {
		this.#clientStore = clientStore;
		this.#socketHandler = socketHandler;
		this.#gameFieldService = gameFieldService;
	}

	updateGameState() {
		// todo logic from SocketHandler into smaller methods
	}
}
