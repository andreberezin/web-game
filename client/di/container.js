import {asClass, createContainer} from 'awilix';
import GameService from '../services/GameService.js';
import PlayerInputService from '../services/PlayerInputService.js';
import PlayerService from '../services/PlayerService.js';
import GameInterface from '../models/GameInterface.js';
import GameInterfaceService from '../services/GameInterfaceService.js';
import PlayerInterfaceService from '../services/PlayerInterfaceService.js';
import SocketHandler from '../sockets/SocketHandler.js';
import ClientManager from '../core/ClientManager.js';
import GameFieldService from '../services/GameFieldService.js';
import clientStore from '../stores/clientStore.js';
import {BulletService} from '../services/BulletService.js';

const container = createContainer();

container.register({
	playerInputService: asClass(PlayerInputService).singleton(),
	playerService: asClass(PlayerService).singleton(),
	gameService: asClass(GameService).singleton(),
	gameFieldService: asClass(GameFieldService).singleton(),
	gameInterface: asClass(GameInterface).singleton(),
	gameInterfaceService: asClass(GameInterfaceService).singleton(),
	playerInterfaceService: asClass(PlayerInterfaceService).singleton(),
	bulletService: asClass(BulletService).singleton(),
	socketHandler: asClass(SocketHandler).singleton(),
	clientManager: asClass(ClientManager).singleton(),
	clientStore: asClass(clientStore).singleton(),
});


export default container;