import '../styles/gamefield.scss'
import '../styles/player.scss'
import '../styles/bullet.css'
import '../styles/userInterfaces.scss'
import {Menu} from '../components/menu/Menu.jsx';
import {useEffect, useState} from 'react';
import {ClientManager} from './ClientManager.js';

const clientManager = ClientManager.createClientManager();
clientManager.socketHandler.connectToServer();

function App() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const SHOW_MENU = import.meta.env.VITE_SHOW_MENU;

    useEffect(() => {
        console.log("SHOW MENU: ", SHOW_MENU);

        if (SHOW_MENU === "FALSE") {
            const socket = clientManager.socketHandler.socket;

            socket.on('connect', () => {
                console.log("socket", socket.id);
                socket.emit('createGame', socket.id);

                clientManager.gameInterfaceService.createGameUI();
                clientManager.startRenderLoop();
            })


        }
    }, []);


    // with menu enabled
    if (SHOW_MENU === "TRUE") {

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
