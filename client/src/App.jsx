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
    let myID = null;

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
            // console.log("player: ", player)
            // console.log("playerID: ", playerID)
            myID = playerID;
            player.createPlayerModel(newPlayer);
            //player.setPosition(data);
            players[playerID] = player;
            // console.log("players object: ", players)
            // players.push(player);
        })

        socket.on('game state', (updatedGameState) => {
            // console.log("updatedGameState:", updatedGameState);
            players[myID] = updatedGameState.players[myID]
        })


        function renderLoop(timestamp) {

            //player.update(timestamp)

            // console.log("myID: ", myID);
            //
            // console.log("player: ", players);

            for (let playerID in players) {
                if (playerID && players[playerID] != null) {
                    // console.log("playerID: ", playerID);
                    console.log("players[playerID]: ", players[playerID]);
                    players[playerID].update(timestamp, players[playerID])
                }
            }

            if (myID) {
                //console.log("players[myID].playerInput: ", players[myID].playerInput);
                socket.emit("player data", players[myID].playerInput, players[myID].getShift, players[myID].getMaxPosition);
            }

            /*for (let playerID in players) {
                //console.log(Object.keys(players))
                //console.log(players)
                //console.log(players[key])
                players[playerID].update(timestamp, players[playerID])
            }*/

            requestAnimationFrame(renderLoop)
        }

        requestAnimationFrame(renderLoop);

        return () => {
            socket.disconnect();
        };
    }, []);

  return (
      <div id={"game-field"} onClick={() => {
          if (document.getElementById(myID)) {
              document.getElementById(myID).focus()
          }
      }}
      >
      </div>
  )
}

export default App
