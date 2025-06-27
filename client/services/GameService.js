
export class GameService {

	#clientManager;

	constructor(playerInputService) {
		this.playerInputService = playerInputService;
	}

	// updateSettings(updatedSettings) {
	// 	this.#settings = {...this.#settings, ...updatedSettings};
	// }
	//
	// updateState(updatedState) {
	// 	this.#state = {...this.#state, ...updatedState};
	// }

	// setClientManager(clientManager) {
	// 	this.#clientManager = clientManager;
	// }
	//
	// createGame(hostId, settings) {
	// 	return new Game(hostId, settings);
	// }
	//
	// updateGameState(game) {
	//
	// 	// handle player input
	// 	this.playerInputService.handlePlayerMovement(game);
	//
	// }
}
