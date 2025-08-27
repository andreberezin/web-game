import Game from '../models/Game.js';

export default class GameService {
    #playerInputService;
    #serverStore;
    #bulletService;
    #powerupService;
    #gamesManager;
    #playerService

    constructor({playerInputService, serverStore, bulletService, powerupService, playerService}) {
        this.#playerInputService = playerInputService;
        this.#serverStore = serverStore;
        this.#bulletService = bulletService;
        this.#powerupService = powerupService;
        this.#playerService = playerService;
    }

    setGamesManager(gamesManager) {
        this.#gamesManager = gamesManager;
    }

    createGame(hostId, settings) {
        return new Game(hostId, settings);
    }

    updateGameState(game, currentTime) {

        // if (game.state.status === "started" && game.state.timeRemaining > 0) {
        //     this.handleGameTimer(game, currentTime);
        // }
        const status = game.state.status;

        if (status !== "paused" && status !== "waiting") {
            this.#bulletService.updateBullets(game);
            this.#powerupService.updatePowerups(game, currentTime);
        }

        if (status === "started") {
            for (const playerID in game.state.players) {
                const player = game.state.players[playerID];

                this.#powerupService.updatePlayerPowerups(player, currentTime);
                this.#playerInputService.handlePlayerMovement(player, game);
                this.#playerInputService.handlePlayerShooting(player, currentTime, game);
                this.checkForCollisions(player, currentTime, game.state);
                this.#playerInputService.handlePlayerRespawning(game.state, currentTime);
                this.#playerInputService.handlePlayerRespawnTimer(player, currentTime);
            }
        }
    }

    startGame(game) {
        game.state.startTime = Date.now();
        if (game.state.timeRemaining > 0) {
            this.handleGameTimer(game);
        }
    }

    pauseGame() {

    }

    finishGame(gameId) {
        setTimeout(() => {
            this.#gamesManager.deleteGame(gameId);
        }, 1000)
    }

    // todo there's a delay between game status change and timer starting. Possibly call this logic in socketHandler instead straight after changing the game status?
    handleGameTimer(game) {

        function countdown() {
            const state = game.state;

            const elapsed = Date.now() - state.startTime;
            state.timeRemaining = Math.max(0, game.settings.duration - elapsed);
            //console.log("Time remaining:", game.state.timeRemaining);

            if (state.timeRemaining > 0 && state.status === "started") {
                setTimeout(countdown, 10)

            } else {
                // todo logs randomly
                console.log("Timer has stopped: ", game.state.timeRemaining / 1000);
            }
        }

        setTimeout(countdown, 10);
    }

    checkForCollisions(player, currentTime, {bullets, deadPlayers, powerups}) {
        const bulletsToDelete = [];
        const powerupsToDelete = [];

            if (player.status.alive) {
                for (let bulletID in bullets) {
                    const bullet = bullets[bulletID];
                    let bulletEndX = bullet.pos.x + bullet.velocityPerSecond * bullet.direction.x;
                    let bulletEndY = bullet.pos.y + bullet.velocityPerSecond * bullet.direction.y;

                    if (this.raycastToPlayer(bullet.pos.x, bullet.pos.y, bulletEndX, bulletEndY, bullet, player)) {
                        console.log("player hit");
                        player.hp = player.hp - 20 * bullet.damageMultiplier;
                        if (player.hp <= 0) {
                            // Player dies if hp is 0
                            player.handleDeath();
                            player.diedAt(currentTime);
                            deadPlayers[player.id] = player;
                            //delete game.state.players[playerID];
                        }

                        bulletsToDelete.push(bulletID);
                    }
                }

                for (let powerupID in powerups) {
                    const powerup = powerups[powerupID];

                    if (powerup.pos.x + 10 > player.pos.x && powerup.pos.x < player.pos.x + 20 && powerup.pos.y + 10 > player.pos.y && powerup.pos.y < player.pos.y + 20) {
                        powerup.givePowerup(player, currentTime);
                        powerupsToDelete.push(powerupID);
                    }
                }
            }

        bulletsToDelete.forEach(bulletID => {
            delete bullets[bulletID];
        });
        powerupsToDelete.forEach(powerupID => {
            delete powerups[powerupID];
        });
    }

    addPlayerToGame(gameId, playerId, player) {
        const game = this.#serverStore.games.get(gameId);
        if (!game) {
            throw new Error("Game not found, cannot add player");
        }

        return this.canAddPlayer(game)
            ? this.addPlayer(game, playerId, player)
            : false;
    }

    canAddPlayer(game) {
        const currentPlayerCount = Object.keys(game.state.players).length;
        const maxPlayersAllowed = game.settings.maxPlayers;
        return currentPlayerCount < maxPlayersAllowed;
    }

    addPlayer(game, playerId, player) {
        game.state.players[playerId] = player;
    }

    raycastToWalls(startX, startY, endX, endY, objectSize, game) {
        const steps = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
        const stepSize = Math.max(1, Math.floor(steps / 10));

        for(let step = 0; step <= steps; step += stepSize) {
            const t = step / steps;
            const checkX = startX + (endX - startX) * t;
            const checkY = startY + (endY - startY) * t;

            if(this.wouldCollideWithWalls(checkX, checkY, objectSize, game)) {
                return true;
            }
        }

        return false;
    }

    raycastToPlayer(bulletStartX, bulletStartY, bulletEndX, bulletEndY, bullet, player) {
        const steps = Math.max(Math.abs(bulletEndX - bulletStartX), Math.abs(bulletEndY - bulletStartY));
        const stepSize = Math.max(1, Math.floor(steps / 10));

        for(let step = 0; step <= steps; step += stepSize) {
            const t = step / steps;
            const checkX = bulletStartX + (bulletEndX - bulletStartX) * t;
            const checkY = bulletStartY + (bulletEndY - bulletStartY) * t;

            if (this.wouldCollideWithPlayer(checkX, checkY, bullet, player)) {
                return true;
            }
        }

        return false;
    }

    wouldCollideWithPlayer(checkX, checkY, bullet, player) {
        return !!(checkX + 5 > player.pos.x && checkX < player.pos.x + 20 && checkY + 5 > player.pos.y && checkY < player.pos.y + 20);
    }

    wouldCollideWithWalls(x, y, objectSize, game) {
        if (!game || !game.map) {
            return false;
        }

        const TILE_SIZE = 40;
        const TILES_X = 48;

        // Convert pixel coordinates to tile coordinates
        const topLeft = {
            x: Math.floor(x / TILE_SIZE),
            y: Math.floor(y / TILE_SIZE)
        };

        const bottomRight = {
            x: Math.floor((x + objectSize - 1) / TILE_SIZE),
            y: Math.floor((y + objectSize - 1) / TILE_SIZE)
        };

        for (let tileY = topLeft.y; tileY <= bottomRight.y; tileY++) {
            for (let tileX = topLeft.x; tileX <= bottomRight.x; tileX++) {
                if (this.getTileAt(game.map, tileX, tileY, TILES_X)) {
                    return true;
                }
            }
        }

        return false;
    }

    getTileAt(mapArray, tileX, tileY, tilesX) {
        // Check bounds (treat out-of-bounds as walls)
        if (tileX < 0 || tileX >= tilesX || tileY < 0) {
            return true; // Wall
        }

        const index = tileY * tilesX + tileX;

        // Check if index is valid
        if (index >= mapArray.length) {
            return true; // Wall
        }

        return mapArray[index] === 1; // Return true if wall (1), false if empty (0)
    }
}
