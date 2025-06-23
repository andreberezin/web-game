import {Player} from '../models/Player.js'
import {clamp} from '../utils/clamp.js';

export function setupGame(io) {

    const gameState = {
        players: {}
    }

    io.on('connection', (socket) => {
        socket.on('createNewPlayer', () => {
            gameState.players[socket.id] = new Player(socket.id)
            io.emit('newPlayerCreated', gameState.players[socket.id], socket.id);
        })

        socket.on('fetchOtherPlayers', () => {
            socket.emit('sendOtherPlayers', (gameState.players));
        })

        socket.on('player data', (input, shift, maxPosition) => {

            if (gameState.players[socket.id]) {
                gameState.players[socket.id].input = input;
                gameState.players[socket.id].shift = shift;
                gameState.players[socket.id].maxPosition = maxPosition;
            }
        });

        socket.on('disconnect', () => {
            console.log("gamestate.players: ", gameState.players);
            if (gameState.players[socket.id]) {
                delete gameState.players[socket.id];
            }
        });
    })

    const TICK_RATE = 1000/60

    function gameLoop() {

        updateGame();

        io.emit('game state', (gameState));

        setTimeout(gameLoop, TICK_RATE);
    }
    
    function updateGame() {

        for (let playerID in gameState.players) {
            const player = gameState.players[playerID]

            if (player.input) {

                if (player.input.arrowUp === true) {
                    player.pos.y = clamp(0, player.pos.y - player.shift, player.maxPosition.y)
                }
                if (player.input.arrowDown === true) {
                    player.pos.y = clamp(0, player.pos.y + player.shift, player.maxPosition.y)
                }
                if (player.input.arrowLeft === true) {
                    player.pos.x = clamp(0, player.pos.x - player.shift, player.maxPosition.x)
                }
                if (player.input.arrowRight === true) {
                    player.pos.x = clamp(0, player.pos.x + player.shift, player.maxPosition.x)
                }
            }
        }
    }

    gameLoop();
}
