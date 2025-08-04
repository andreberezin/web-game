export class TileMapService {

	constructor({TileMap}) {
		this.tileMap = TileMap;
	}

	draw() {
		const tileMap = this.tileMap;

		for (let i = 0; i < tileMap.mapWidth; i++) {
			for (let j = 0; j < tileMap.mapHeight; j++) {

			}
		}
	}
}