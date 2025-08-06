import {asClass, createContainer} from 'awilix';
import PlayerInputService from '../services/PlayerInputService.js';
import GameService from '../services/GameService.js';
import SocketHandler from '../sockets/SocketHandler.js';
import GamesManager from '../core/GamesManager.js';
import serverStore from '../stores/serverStore.js';

const container = createContainer()

container.register({
	playerInputService: asClass(PlayerInputService).singleton(),
	gameService: asClass(GameService).singleton(),
	socketHandler: asClass(SocketHandler).singleton(),
	gamesManager: asClass(GamesManager).singleton(),
	serverStore: asClass(serverStore).singleton(),
})

export default container;