import '../styles/gamefield.scss'
import '../styles/lobby.scss'
import '../styles/scoreboard.scss'
import '../styles/player.scss'
import '../styles/bullet.css'
import '../styles/powerup.css'
import '../styles/userInterfaces.scss'
import '../styles/error.scss'
import {Menu} from '../components/menu/Menu.jsx';
import {useEffect, useRef, useState} from 'react';
import {createClientManager} from './createClientManager.js';
import {Error} from '../components/menu/Error.jsx';

const clientManager = createClientManager();
clientManager.socketHandler.connectToServer();

function App() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [error, setError] = useState(null);
    const SHOW_MENU = import.meta.env.VITE_SHOW_MENU;

    const gameSettings = useRef({
        private: false,
        maxPlayers: 4,
        mapType: "empty",
        duration: 600000,
    });

    useEffect(() => {
        console.log("SHOW MENU: ", SHOW_MENU);

        if (SHOW_MENU === "FALSE") {
            const socket = clientManager.socketHandler.socket;

            socket.on('connect', () => {
                console.log("Socket connected with ID:", socket.id);

                // Listen once for available games
                socket.once('updateAvailableGames', (gamesList) => {
                    if (gamesList.length > 0) {
                        // Join the first available game
                        const firstGameId = gamesList[0].id
                        console.log("Joining game:", firstGameId);
                        socket.emit('joinGame', firstGameId, socket.id);
                    } else {
                        // Create a new game
                        console.log("Creating new game with ID:", socket.id);
                        socket.emit('createGame', socket.id, socket.id, gameSettings.current);
                    }
                });
            });
        }
    }, [SHOW_MENU]);

    useEffect(() => {
        function updateScale() {
            const scaleX = (window.innerWidth * 0.99) / 1920;
            const scaleY = (window.innerHeight * 0.90) / 1080; // match 90% height from #game-field
            const scale = Math.min(scaleX, scaleY);

            document.documentElement.style.setProperty('--scale', scale);
        }

        updateScale();

        window.addEventListener('resize', () => {
            updateScale();
        });
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    useEffect(() => {
        clientManager.onGameEnd = () => {
            setTimeout(() => {
                setIsGameStarted(false);
                console.log("Rerendering menu");
            }, 100)
        };
    }, []);

    // with menu enabled
    if (SHOW_MENU === "TRUE") {

        return (
            <>
                {!isGameStarted && (
                    <Menu clientManager={clientManager} isGameStarted={isGameStarted} setIsGameStarted={setIsGameStarted} setError={setError}></Menu>
                )}
                {error && <Error error={error} setError={setError} />}
            </>

        )
        // menu disabled
    } else {

        return (
            <>
                {error && <Error error={error} setError={setError} />}
            </>
        )
    }
}

export default App
