import {asClass, createContainer} from 'awilix';
import PlayerInputService from '../services/PlayerInputService.js';
import GameService from '../services/GameService.js';
import PlayerService from '../services/PlayerService.js';
import SocketHandler from '../sockets/SocketHandler.js';
import GamesManager from '../core/GamesManager.js';
import serverStore from '../stores/serverStore.js';
import BulletService from '../services/BulletService.js';
import PowerupService from '../services/PowerupService.js';

const container = createContainer()

container.register({
	playerInputService: asClass(PlayerInputService).singleton(),
	gameService: asClass(GameService).singleton(),
	playerService: asClass(PlayerService).singleton(),
	bulletService: asClass(BulletService).singleton(),
	powerupService: asClass(PowerupService).singleton(),
	socketHandler: asClass(SocketHandler).singleton(),
	gamesManager: asClass(GamesManager).singleton(),
	serverStore: asClass(serverStore).singleton(),
})

export default container;