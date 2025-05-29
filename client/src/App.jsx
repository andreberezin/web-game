import {useEffect} from 'react'
import './App.css'
import { io } from 'socket.io-client';
import { Player } from './components/Player.js';

function App() {

    const id = "player-2"

    // let player = new Player({x: 200, y: 200}, id);
    let player = new Player(id);

    useEffect(() => {
        console.log('Connecting to socket...');

        const socket = io()

        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
        });

        player.insertPlayer();

        socket.on('backend', (data) => {
            //console.log(data);
            player.setPosition(data);
        })

        function renderLoop(timestamp) {

            player.update(timestamp)

            socket.emit("player data", player.playerInput, player.getShift, player.getMaxPosition);

            requestAnimationFrame(renderLoop)
        }

        requestAnimationFrame(renderLoop);

        return () => {
            socket.disconnect();
        };
    }, []);

  return (
      <div id={"game-field"} onClick={() => {
          const playerElement = document.getElementById(id)
          if (playerElement) {
              playerElement.focus();
          }
      }}>
      </div>
  )
}

export default App
