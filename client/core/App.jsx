import '../styles/gamefield.scss'
import '../styles/player.scss'
import '../styles/bullet.css'
import '../styles/userInterfaces.scss'
import {PlayerInputService} from '../services/PlayerInputService.js';
import {PlayerService} from '../services/PlayerService.js';
import {SocketHandler} from '../sockets/SocketHandler.js';
import {ClientManager} from './ClientManager.js';
import {GameService} from '../services/GameService.js';
import {Menu} from '../components/menu/Menu.jsx';
import {useEffect, useState} from 'react';
import {GameInterfaceService} from '../services/GameInterfaceService.js';
import {GameInterface} from '../models/GameInterface.js';
import {PlayerInterfaceService} from '../services/PlayerInterfaceService.js';

export function createClientManager() {
    const playerInputService = new PlayerInputService();
    const playerService = new PlayerService(playerInputService);
    const gameService = new GameService(playerInputService);
    const gameInterface = new GameInterface();
    const gameInterfaceService = new GameInterfaceService(gameInterface);
    const playerInterfaceService = new PlayerInterfaceService();
    const socketHandler = new SocketHandler(playerService, playerInterfaceService, gameInterface);
    const clientManager = new ClientManager(gameService, gameInterfaceService, playerInterfaceService, playerService, socketHandler);

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

    // useEffect(() => {
    //     if (SHOW_MENU === "FALSE") setIsGameStarted(true);
    // })

    useEffect(() => {
        console.log("SHOW MENU: ", SHOW_MENU);

        if (SHOW_MENU === "FALSE") {
            clientManager.socketHandler.connectToServer();
            clientManager.startRenderLoop();
            clientManager.gameInterfaceService.createGameUI();

            const root = document.getElementById("root");
            root.style.display = "flex";
            root.style.flexDirection = "column-reverse";
        }
    }, []);

    // if (isGameStarted || SHOW_MENU === "FALSE") {
    //     clientManager.gameInterfaceService.createGameUIElements();
    // }

    // with menu enabled
    if (SHOW_MENU === "TRUE") {

        if (isGameStarted) {
            clientManager.gameInterfaceService.createGameUI();
        }

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
        // clientManager.socketHandler.connectToServer();
        // clientManager.startRenderLoop();
        // clientManager.gameInterfaceService.createGameUIElements();

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
}

export default App
