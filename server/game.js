import {Player} from './entities/Player.js'

export function setupGame(io) {

    const gameState = {
        players: {}
    }

    io.on('connection', (socket) => {
        socket.on('createNewPlayer', () => {
            gameState.players[socket.id] = new Player(socket.id)
            io.emit('newPlayerCreated', gameState.players[socket.id], socket.id);
        })

        socket.on('player data', (input, shift, maxPosition) => {

            // console.log("gamestate.players: ", gameState.players);

            if (gameState.players[socket.id]) {
                // console.log("gamestate.players[socket.id].playerInput: ", input);
                gameState.players[socket.id].input = input;
                gameState.players[socket.id].shift = shift;
                gameState.players[socket.id].maxPosition = maxPosition;
            }
            /*console.log("playerinput: ", gameState.players[socket.id].playerInput)
			console.log("playershift: ", gameState.players[socket.id].playerShift)
			console.log("playermaxPos: ", gameState.players[socket.id].playerMaxPosition)*/

            // console.log("player data in backend: ", input, shift, maxPosition);
            //console.log("Player data: ", data);
            // playerInput = input;
            // playerShift = shift;
            // playerMaxPosition = maxPosition;
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
        // processInputQueue();

        updateGame();

        // console.log("gameState: ", gameState.players);
        io.emit('game state', (gameState));

        // broadcastGameState();

        setTimeout(gameLoop, TICK_RATE);
    }

    function clamp(min, val, max) {
        return val > max ? max : val < min ? min : val;
    }

    function updateGame() {

        for (let playerID in gameState.players) {
            const player = gameState.players[playerID]

            if (player.input) {
                // console.log("player input in updateGame: ", player.playerInput);

                if (player.input.arrowUp === true) {
                    console.log("arrow up true");
                    console.log("player.pos.y: ", player.pos.y)
                    player.pos.y = clamp(0, player.pos.y - player.shift, player.maxPosition.y)
                }
                if (player.input.arrowDown === true) {
                    console.log("arrow down true");
                    player.pos.y = clamp(0, player.pos.y + player.shift, player.maxPosition.y)
                }
                if (player.input.arrowLeft === true) {
                    console.log("arrow left true");
                    player.pos.x = clamp(0, player.pos.x - player.shift, player.maxPosition.x)
                }
                if (player.input.arrowRight === true) {
                    console.log("arrow right true");
                    player.pos.x = clamp(0, player.pos.x + player.shift, player.maxPosition.x)
                }
            }
        }
    }

    gameLoop();


}
