export class PlayerInputService {

	handleKeyDown(event, player) {
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
