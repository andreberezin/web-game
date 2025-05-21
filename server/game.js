const TICK_RATE = 1000/60

function gameLoop() {
    // processInputQueue();

    // updateGame();

    // broadcastGameState();

    setTimeout(gameLoop, TICK_RATE);
}

gameLoop();
