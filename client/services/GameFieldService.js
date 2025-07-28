export default class GameFieldService {

	constructor() {}

	createElement() {
		console.log("Creating game field");

		const root = document.getElementById('root');
		const game = document.createElement('div');
		game.id = 'game';

		const gameField = document.createElement('div');
		gameField.id = 'game-field';
		gameField.addEventListener('click', () => {
			if (document.getElementsByClassName("me")) {
				document.getElementsByClassName("me")[0].focus();
			}
		})

		const gameInner = document.createElement('div');
		gameInner.id = 'game-inner';

		root.append(game);
		game.append(gameField);
		gameField.append(gameInner);
	}
}