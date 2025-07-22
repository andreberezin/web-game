import '../styles/gamefield.scss'
import '../styles/player.scss'
import '../styles/bullet.css'
import '../styles/userInterfaces.scss'
import {Menu} from '../components/menu/Menu.jsx';
import {useEffect, useState} from 'react';
import {createClientManager} from './createClientManager.js';

const clientManager = createClientManager();
clientManager.socketHandler.connectToServer();

function App() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const SHOW_MENU = import.meta.env.VITE_SHOW_MENU;

    useEffect(() => {
        console.log("SHOW MENU: ", SHOW_MENU);

        if (SHOW_MENU === "FALSE") {
            const socket = clientManager.socketHandler.socket;

            socket.on('connect', () => {
                console.log("Socket connected with ID:", socket.id);

                // Listen once for available games
                socket.once('availableGames', (gamesArray) => {
                    const games = new Map(gamesArray);
                    console.log("Available games:", games);

                    if (games.size > 0) {
                        // Join the first available game
                        const [firstGameId] = games.keys();
                        console.log("Joining game:", firstGameId);
                        socket.emit('joinGame', firstGameId);
                    } else {
                        // Create a new game
                        console.log("Creating new game with ID:", socket.id);
                        socket.emit('createGame', socket.id);
                    }

                    // After joining/creating, start UI/render loop
                    clientManager.gameInterfaceService.createGameUI();
                    clientManager.startRenderLoop();
                });

                // Fetch available games immediately after connect
                socket.emit('fetchAvailableGames');
            });
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
