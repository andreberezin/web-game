import {useEffect} from 'react'
import './App.css'
import { io } from 'socket.io-client';
import { Player } from './components/Player.js';

function App() {
    const gameState = {
        players: {

        }
    }
    let myID = null;

    useEffect(() => {
        console.log('Connecting to socket...');

        const socket = io()

        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
            socket.emit('createNewPlayer');
            socket.emit('fetchOtherPlayers');
        });



        //player.insertPlayer();
        socket.on('sendOtherPlayers', (playersData) => {
            console.log("Creating other players: ", playersData);

            let i = 1;
            for (const playerID in playersData) {


                //if (playerID !== myID) {
                    let player = new Player(playerID);
                    gameState.players[playerID].setName(`player${i}`);
                    player.createPlayerModel(playersData[playerID]);
                    gameState.players[playerID] = player;
                    i++;
                //}
            }

            i = 0;
        })


        socket.on('newPlayerCreated', (newPlayer, playerID) => {
            let player = new Player(playerID);
            myID = playerID;
            //player.createPlayerModel(newPlayer);
            gameState.players[playerID] = player;
        })

        socket.on('game state', (updatedGameState) => {
            for (const playerID in gameState.players) {

                if (!updatedGameState.players[playerID]) {
                    document.getElementById(playerID).remove();
                    delete gameState.players[playerID];
                    continue;
                }

                if (gameState.players[playerID]) { // ensure the player exists
                    gameState.players[playerID].setPosition(updatedGameState.players[playerID].pos);
                    gameState.players[playerID].setShift(updatedGameState.players[playerID].shift);
                }
            }
        })

        function renderLoop(timestamp) {

            for (let playerID in gameState.players) {
                if (playerID && gameState.players[playerID] != null) {
                    gameState.players[playerID].update(timestamp, gameState.players[playerID]);
                }
            }

            if (myID) {
                socket.emit("player data", gameState.players[myID].input, gameState.players[myID].getShift, gameState.players[myID].getMaxPosition);
            }

            requestAnimationFrame(renderLoop)
        }

        requestAnimationFrame(renderLoop);

        return () => {
            if (gameState.players) {
                delete gameState.players;
                document.getElementById(socket.id).remove();
            }
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
