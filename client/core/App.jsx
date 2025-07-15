import '../styles/gamefield.css'
import '../styles/player.scss'
import '../styles/bullet.css'
import {PlayerInputService} from '../services/PlayerInputService.js';
import {PlayerService} from '../services/PlayerService.js';
import {SocketHandler} from '../sockets/SocketHandler.js';
import {ClientManager} from './ClientManager.js';
import {GameService} from '../services/GameService.js';
import {Menu} from '../components/menu/Menu.jsx';
import {useState} from 'react';

export function createClientManager() {
    const playerInputService = new PlayerInputService();
    const playerService = new PlayerService(playerInputService);
    const gameService = new GameService(playerInputService);
    const socketHandler = new SocketHandler(playerService);
    const clientManager = new ClientManager(gameService, playerService, socketHandler);


    socketHandler.setClientManager(clientManager);
    gameService.setClientManager(clientManager);
    playerService.setClientManager(clientManager);
    socketHandler.setGameService(gameService);

    //socketHandler.connectToServer();

    //clientManager.startRenderLoop();
    clientManager.setupCleanup();

    return clientManager;
}

const clientManager = createClientManager();

function App() {
    const [isGameStarted, setIsGameStarted] = useState(false);

    const SHOW_MENU = import.meta.env.VITE_SHOW_MENU;

    // with menu enabled
    if (SHOW_MENU === "TRUE") {
        console.log("SHOW_MENU: ", SHOW_MENU);

        return (
            <>
                {!isGameStarted && (
                    <Menu clientManager={clientManager} isGameStarted={isGameStarted} setIsGameStarted={setIsGameStarted}></Menu>
                )}
                {isGameStarted && (
                    <div id={"game-field"} onClick={() => {
                        if (document.getElementById(clientManager.myID)) {
                            (document.getElementById(clientManager.myID).focus())
                        }
                    }}
                    >
                    </div>
                )}
            </>

        )
        // menu disabled
    } else {
        console.log("SHOW_MENU: ", SHOW_MENU);
        clientManager.socketHandler.connectToServer();
        clientManager.startRenderLoop();

        return (
            <div id={"game-field"} onClick={() => {
                if (document.getElementById(clientManager.myID)) {
                    (document.getElementById(clientManager.myID).focus())
                }
            }}
            >
            </div>
        )
    }

  // return (
  //     // <div id={"game-field"} onClick={() => {
  //     //     if (document.getElementById(clientManager.myID)) {
  //     //         (document.getElementById(clientManager.myID).focus())
  //     //     }
  //     // }}
  //     // >
  //     // </div>
  //     // <Menu></Menu>
  // )
}

export default App
