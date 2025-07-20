// import {PlayerInputService} from '../services/PlayerInputService.js';
// import {PlayerService} from '../services/PlayerService.js';
// import {GameService} from '../services/GameService.js';
// import {GameInterface} from '../models/GameInterface.js';
// import {GameInterfaceService} from '../services/GameInterfaceService.js';
// import {PlayerInterfaceService} from '../services/PlayerInterfaceService.js';
// import {SocketHandler} from '../sockets/SocketHandler.js';
// import {ClientManager} from './ClientManager.js';
//
// export function createClientManager() {
// 	const playerInputService = new PlayerInputService();
// 	const playerService = new PlayerService(playerInputService);
// 	const gameService = new GameService(playerInputService);
// 	const gameInterface = new GameInterface();
// 	const gameInterfaceService = new GameInterfaceService(gameInterface);
// 	const playerInterfaceService = new PlayerInterfaceService();
// 	const socketHandler = new SocketHandler(playerService, playerInterfaceService, gameInterface);
// 	const clientManager = new ClientManager(gameService, gameInterfaceService, playerInterfaceService, playerService, socketHandler);
//
// 	socketHandler.setClientManager(clientManager);
// 	gameService.setClientManager(clientManager);
// 	playerService.setClientManager(clientManager);
// 	socketHandler.setGameService(gameService);
//
// 	//socketHandler.connectToServer();
//
// 	//clientManager.startRenderLoop();
// 	clientManager.setupCleanup();
//
// 	return clientManager;
// }