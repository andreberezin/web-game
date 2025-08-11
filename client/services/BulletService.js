export class BulletService {
	constructor() {}

	removeBullets(bullets) {
		debugger
		for (const bulletId in bullets) {

			// if (bulletElement) {
			// 	bulletElement.remove();
			// }
			delete bullets[bulletId];
		}

		const bulletElements = document.getElementsByClassName("bullet");

		for (const bullet of bulletElements) {
			debugger
			bullet.remove();
		}
	}
}