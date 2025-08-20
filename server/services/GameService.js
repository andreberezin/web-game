import Game from '../models/Game.js';
import Bullet from "../models/Bullet.js";
import Powerup from "../models/Powerup.js";

export default class GameService {
    #playerInputService
    #serverStore
    #bulletService
    #powerupService

    constructor({playerInputService, serverStore, bulletService, powerupService}) {
        this.#playerInputService = playerInputService;
        this.#serverStore = serverStore;
        this.#bulletService = bulletService;
        this.#powerupService = powerupService;
    }

    createGame(hostId, settings) {
        return new Game(hostId, settings);
    }

    updateGameState(game, currentTime) {

        // if (game.state.status === "started" && game.state.timeRemaining > 0) {
        //     this.handleGameTimer(game, currentTime);
        // }

        this.updateBullets(game);

        if (game.state.status === "started") {
            this.#powerupService.updatePowerups(game, currentTime);

            for (const playerID in game.state.players) {
                const player = game.state.players[playerID];

                this.checkForCollisions(player, currentTime, game.state);
                this.#playerInputService.handlePlayerMovement(player, game);
                this.#playerInputService.handlePlayerShooting(player, currentTime, game);
                this.#playerInputService.handlePlayerRespawning(game.state, currentTime);
                this.#playerInputService.handlePlayerRespawnTimer(player, currentTime);
            }
        }
    }

    startGame() {

    }

    pauseGame() {

    }

    finishGame(gameId) {
        // setTimeout(() => {
        //     this.deleteGame(gameId);
        //     console.log("Games: ", this.#serverStore.games);
        // }, 1500)
        this.deleteGame(gameId);
    }

    deleteGame(gameId) {
        console.log("Deleting game: ", gameId);
        this.#serverStore.games.delete(gameId);
    }

    // todo there's a delay between game status change and timer starting. Possibly call this logic in socketHandler instead straight after changing the game status?
    handleGameTimer(game, socket) {
        // const timer = setTimeout(countdown, 10);

        function countdown() {
            const elapsed = Date.now() - game.state.startTime;
            game.state.timeRemaining = Math.max(0, game.settings.duration - elapsed);
            //console.log("Time remaining:", game.state.timeRemaining);

            if (game.state.timeRemaining > 0) {
                setTimeout(countdown, 10)

            } else {
                // game.state.status = "finished"
                // socket.emit('gameStatusChangeSuccess', game.id, game.state.status);
                // todo logs randomly
                console.log("Timer has finished: ", game.state.timeRemaining);
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

                    if (bullet.pos.x + 5 > player.pos.x && bullet.pos.x < player.pos.x + 20 && bullet.pos.y + 5 > player.pos.y && bullet.pos.y < player.pos.y + 20) {
                        //console.log("PLAYER GOT HIT REMOVING 20 HP");
                        player.hp = player.hp - 20 * bullet.damageMultiplier;
                        if (player.hp <= 0) {
                            // Player dies if hp is 0
                            player.lives -= 1;
                            player.input = {
                                space: false,
                                ArrowUp: false,
                                ArrowRight: false,
                                ArrowLeft: false,
                                ArrowDown: false};
                            player.shift = 0;
                            player.movementStart = undefined;
                            player.status.alive = false;
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
                        powerup.givePowerup(player);
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
