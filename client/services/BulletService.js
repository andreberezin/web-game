export class BulletService {
	constructor() {}

	removeBullets(bullets) {
		for (const bulletId in bullets) {

			// if (bulletElement) {
			// 	bulletElement.remove();
			// }
			delete bullets[bulletId];
		}

		const bulletElements = document.getElementsByClassName("bullet");

		for (const bullet of bulletElements) {
			bullet.remove();
		}
	}
}