import {useEffect} from 'react'
import './App.css'
import { io } from 'socket.io-client';
import { Player } from './components/Player.js';

function App() {
    const gameState = {
        players: {

        }
    }
    // let players = {}
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
            // console.log("newPlayer: ", newPlayer);
            let player = new Player(playerID);
            // console.log("player: ", player)
            // console.log("playerID: ", playerID)
            myID = playerID;
            //player.createPlayerModel(newPlayer);
            // console.log("Player object created: ", player);
            //player.setPosition(data);
            gameState.players[playerID] = player;
            //console.log("player object when created: ", gameState.players[playerID]);
            // console.log("players object: ", players)
            // players.push(player);
        })

        socket.on('game state', (updatedGameState) => {
            //console.log(updatedGameState.players[myID].pos);
            // gameState.players[myID].setPosition(updatedGameState.players[myID].pos);
            // gameState.players[myID].setShift(updatedGameState.players[myID].shift);

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

            //player.update(timestamp)

            // console.log("myID: ", myID);
            //
            // console.log("player: ", players);

            for (let playerID in gameState.players) {
                if (playerID && gameState.players[playerID] != null) {
                    // console.log("playerID: ", playerID);
                    //console.log("players[playerID]: ", players[playerID]);
                    gameState.players[playerID].update(timestamp, gameState.players[playerID]);
                }
            }

            if (myID) {
                //console.log("players[myID].playerInput: ", players[myID].playerInput);
                socket.emit("player data", gameState.players[myID].input, gameState.players[myID].getShift, gameState.players[myID].getMaxPosition);
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
