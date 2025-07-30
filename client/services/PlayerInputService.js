export default class PlayerInputService {

	// constructor({socketHandler}) {
	// 	this.socketHandler = socketHandler;
	// }

	// handleKeyPress(event) {
	// 	//if (event.repeat) return;
	// 	const socket = this.socketHandler.socket
	//
	// 	socket.emit('playerInput', {
	// 		key: event.key,
	// 		type: event.type,
	// 		pressedAt: Date.now(),
	// 	})
	// }

	handleKeyDown(event, player) {
		console.log("event keydown:", event);
		switch(event.key) {
			case "ArrowUp": {
				player.input.arrowUp = true;
				break;
			}
			case "ArrowDown": {
				player.input.arrowDown = true;
				break;
			}
			case "ArrowLeft": {
				player.input.arrowLeft = true;
				break;
			}
			case "ArrowRight": {
				player.input.arrowRight = true;
				break;
			}
			case " ": {
				player.input.space = true;
				break;
			}
		}
	}

	handleKeyUp(event, player) {
		console.log("event keyup:", event);
		switch(event.key) {
			case "ArrowUp": {
				player.input.arrowUp = false;
				break;
			}
			case "ArrowDown": {
				player.input.arrowDown = false;
				break;
			}
			case "ArrowLeft": {
				player.input.arrowLeft = false;
				break;
			}
			case "ArrowRight": {
				player.input.arrowRight = false;
				break;
			}
			case " ": {
				player.input.space = false;
				break;
			}
		}
	}
}
