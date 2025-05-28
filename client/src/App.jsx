import {useEffect} from 'react'
import './App.css'
import { io } from 'socket.io-client';
import { Player } from './components/Player.js';

function App() {

    const id = "player-2"

    let player = new Player({x: 200, y: 200}, id);

    useEffect(() => {
        console.log('Connecting to socket...');

        const socket = io()

        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
        });

        socket.on('backend', (data) => {
            //console.log(data);
        })

        player.insertPlayer();

        function renderLoop(timestamp) {

            player.update(timestamp)

            socket.emit("player data", player.position);

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
