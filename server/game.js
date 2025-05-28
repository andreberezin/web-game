const { io } = require('./bin/www');

let playerData = null;

io.on('connection', (socket) => {
    socket.on('player data', (data) => {
        //console.log("Player data: ", data);
        playerData = data;
    });
})

const TICK_RATE = 1000/60

function gameLoop() {
    // processInputQueue();

    // updateGame();

    //console.log("game loop is running");

    io.emit('backend', playerData);

    // broadcastGameState();

    setTimeout(gameLoop, TICK_RATE);
}

gameLoop();

