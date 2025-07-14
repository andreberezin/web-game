import './App.css'
import {PlayerInputService} from '../services/PlayerInputService.js';
import {PlayerService} from '../services/PlayerService.js';
import {SocketHandler} from '../sockets/SocketHandler.js';
import {ClientManager} from './ClientManager.js';
import {GameService} from '../services/GameService.js';

function App() {

    function createClientManager() {
        const playerInputService = new PlayerInputService();
        const playerService = new PlayerService(playerInputService);
        const gameService = new GameService(playerInputService);
        const socketHandler = new SocketHandler(playerService);
        const clientManager = new ClientManager(gameService, playerService, socketHandler);


        socketHandler.setClientManager(clientManager);
        gameService.setClientManager(clientManager);
        playerService.setClientManager(clientManager);
        socketHandler.setGameService(gameService);

        socketHandler.connectToServer();

        clientManager.startRenderLoop();
        clientManager.setupCleanup();

        return clientManager;
    }

    const clientManager = createClientManager();

  return (
      <div id={"game-field"} onClick={() => {
          if (document.getElementById(clientmanager.myID)) {
              document.getElementById(clientmanager.myID).focus()
          }
      }}
      >
      </div>
  )
}

export default App
