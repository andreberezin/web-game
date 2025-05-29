const { io } = require('./server.js');

let playerInput = {
    arrowUp: false,
    arrowDown: false,
    arrowLeft: false,
    arrowRight: false,
};
let playerPos = {
    x: 200,
    y: 200
}
let playerShift = null;
let playerMaxPosition = {
    x: 0,
    y: 0,
};

io.on('connection', (socket) => {
    socket.on('player data', (input, shift, maxPosition) => {
        //console.log("Player data: ", data);
        playerInput = input;
        playerShift = shift;
        playerMaxPosition = maxPosition;
    });
})

const TICK_RATE = 1000/60

function gameLoop() {
    // processInputQueue();

    updateGame();

    //console.log("game loop is running");

    io.emit('backend', playerPos);

    // broadcastGameState();

    setTimeout(gameLoop, TICK_RATE);
}

function clamp(min, val, max) {
    return val > max ? max : val < min ? min : val;
}

function updateGame() {
    if (playerInput.arrowUp === true) {
        playerPos.y = clamp(0, playerPos.y - playerShift, playerMaxPosition.y)
    }
    if (playerInput.arrowDown === true) {
        playerPos.y = clamp(0, playerPos.y + playerShift, playerMaxPosition.y)
    }
    if (playerInput.arrowLeft === true) {
        playerPos.x = clamp(0, playerPos.x - playerShift, playerMaxPosition.x)
    }
    if (playerInput.arrowRight === true) {
        playerPos.x = clamp(0, playerPos.x + playerShift, playerMaxPosition.x)
    }
}

gameLoop();

