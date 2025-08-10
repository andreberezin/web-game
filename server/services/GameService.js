import Game from '../models/Game.js';
import Bullet from "../models/Bullet.js";
import Powerup from "../models/Powerup.js";

export default class GameService {
    #playerInputService
    #serverStore

    constructor({playerInputService, serverStore}) {
        this.#playerInputService = playerInputService;
        this.#serverStore = serverStore;
    }

    createGame(hostId, settings) {
        return new Game(hostId, settings);
    }

    updateGameState(game, currentTime) {

        if (Object.keys(game.state.bullets).length > 1) {
            //console.time("UpdateGameState")
        }

        if (game.state.isRunning && game.state.timeRemaining > 0) {
            this.handleGameTimer(game, currentTime);
        }

        this.updateBullets(game);
        this.updatePowerups(game, currentTime);

        for (const playerID in game.state.players) {
            const player = game.state.players[playerID];

            this.checkForCollisions(player, currentTime, game.state);
            this.#playerInputService.handlePlayerMovement(player, game);
            this.#playerInputService.handlePlayerShooting(player, currentTime, game);
            this.#playerInputService.handlePlayerRespawning(game.state, currentTime);
            this.#playerInputService.handlePlayerRespawnTimer(player, currentTime);
        }

        if (Object.keys(game.state.bullets).length > 1) {
            //console.timeEnd("UpdateGameState")
        }
    }

    handleGameTimer(game, currentTime) {
        const timer = setTimeout(countdown, 1000);

        function countdown() {
            const elapsed = currentTime - game.state.startTime;
            game.state.timeRemaining = Math.max(0, game.settings.duration - elapsed);
            //console.log("Time remaining:", game.state.timeRemaining);

            if (game.state.timeRemaining === 0) {
                clearTimeout(timer)
                //console.log("Timer has finished: ", game.state.timeRemaining);
            }
        }
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

    createPowerup(game) {
        // TODO: add UUID generation instead of math.random
        const id = Math.floor(Math.random() * 10000);
        let x = Math.floor(Math.random() * 1919);
        let y = Math.floor(Math.random() * 1079);
        const typeOfPowerup = Math.floor(Math.random() * 2);
        let foundCoordinatesNotInsideWalls = false;
        while (foundCoordinatesNotInsideWalls == false) {
            if (this.wouldCollideWithWalls(x, y, 20, game)) {
                x = Math.floor(Math.random() * 1919);
                y = Math.floor(Math.random() * 1079);
            } else {
                foundCoordinatesNotInsideWalls = true;
            }
        }
        game.state.powerups[id] = new Powerup(id, x, y, typeOfPowerup);
    }

    updatePowerups(game, currentTime) {
        const timeWhenLastPowerupWasCreated = this.#serverStore.timeWhenLastPowerupWasCreated;
        let currentAmountOfPowerups = Object.keys(game.state.powerups).length;

        //console.log(currentTime - timeWhenLastPowerupWasCreated);
        if (currentAmountOfPowerups <= 5 && ((currentTime - timeWhenLastPowerupWasCreated) > 5000 || timeWhenLastPowerupWasCreated === 0)) {
            this.createPowerup(game);
            this.#serverStore.timeWhenLastPowerupWasCreated = currentTime;
        }
    }

    createBulletAt(x, y, direction, game, playerWidth, damageMultiplier) {
        // TODO: add UUID generation instead of math.random
        const id = Math.floor(Math.random() * 10000);
        const offset = 24;

        let bulletX = x + playerWidth / 2;
        let bulletY = y + playerWidth / 2;

        switch(direction) {
            case "up":
                bulletY -= offset;
                break;
            case "down":
                bulletY += offset;
                break;
            case "left":
                bulletX -= offset;
                break;
            case "right":
                bulletX += offset;
                break;
        }
        game.state.bullets[id] = new Bullet(id, bulletX, bulletY, direction, damageMultiplier);
    }

    updateBullets(game) {
        const bullets = game.state.bullets;
        const directionMap = {
            "up": {coord: "y", multiplier: -1},
            "down": {coord: "y", multiplier: 1},
            "left": {coord: "x", multiplier: -1},
            "right": {coord: "x", multiplier: 1}
        }
        const bulletsToDelete = [];

        Object.entries(bullets).forEach(([bulletId, bullet]) => {
            const directionValues = directionMap[bullet.direction];
            const bulletSize = bullet.size?.width || 20;
            const newPosition = bullet.pos[directionValues.coord] + bullet.velocity * directionValues.multiplier;
            let testX = bullet.pos.x;
            let testY = bullet.pos.y;

            if (directionMap[bullet.direction].coord === 'x') {
                testX = newPosition;
            } else {
                testY = newPosition;
            }

            this.moveBulletByVelocity(bullet, directionValues);

            if (this.wouldCollideWithWalls(testX, testY, bulletSize, game) || this.isOutOfBounds(bullet.pos)) {
                bulletsToDelete.push(bulletId);
            }
        });

        this.deleteBulletsOutOfBounds(bulletsToDelete, bullets);
    }

	moveBulletByVelocity(bullet, directionValues) {
            if (directionValues) {
                bullet.pos[directionValues.coord] += bullet.velocity * directionValues.multiplier;
            }
	}

	deleteBulletsOutOfBounds(bulletsToDelete, bullets) {
        bulletsToDelete.forEach(bulletId => {
            delete bullets[bulletId];
        });
	}

    isOutOfBounds(pos) {
        const { MIN_X, MAX_X, MIN_Y, MAX_Y } = this.#serverStore.GAME_BOUNDS;
        return pos.y < MIN_Y || pos.y > MAX_Y || pos.x < MIN_X || pos.x > MAX_X;
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
