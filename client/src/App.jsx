import {useEffect} from 'react'
import './App.css'
import { io } from 'socket.io-client';
import { Player } from './components/Player.js';

function App() {
    /*const gamestate = {
        players: {

        }
    }*/
    let players = {}

    useEffect(() => {
        console.log('Connecting to socket...');

        const socket = io()

        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
        });

        socket.emit('createNewPlayer');

        //player.insertPlayer();

        socket.on('newPlayerCreated', (newPlayer, playerID) => {
            //console.log(data);
            let player = new Player(playerID);
            console.log("newPlayer: ", newPlayer)
            console.log("playerID: ", playerID)
            player.createPlayerModel(newPlayer);
            //player.setPosition(data);
            players[playerID] = player;
            console.log("players object: ", players)
            // players.push(player);
        })

        function renderLoop(timestamp) {

            for (let key in players) {
                //console.log(Object.keys(players))
                //console.log(players)
                //console.log(players[key])
                players[key].update(timestamp)
            }
            //player.update(timestamp)

            //socket.emit("player data", player.playerInput, player.getShift, player.getMaxPosition);

            requestAnimationFrame(renderLoop)
        }

        requestAnimationFrame(renderLoop);

        return () => {
            socket.disconnect();
        };
    }, []);

  return (
      <div id={"game-field"} onClick={() => {
          // const playerElement = document.getElementById(id)
          // if (playerElement) {
          //     playerElement.focus();
          // }
      }}>
      </div>
  )
}

export default App
