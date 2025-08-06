import {clamp} from '../utils/clamp.js';

export default class PlayerInputService {
    #gameService;

    constructor() {}

    setGameService(gameService) {
        this.#gameService = gameService;
    }

    // handlePlayerMovement(player) {
    //         if (!player.input) return;
    //
    //         const speed = player.speed
    //
    //         const {ArrowUp, ArrowDown, ArrowLeft, ArrowRight} = player.input;
    //         if (ArrowUp) {
    //             this.movePlayer(player, 'y', -speed, "up");
    //         }
    //         if (ArrowDown) {
    //             this.movePlayer(player, 'y', speed, "down");
    //         }
    //         if (ArrowLeft) {
    //             this.movePlayer(player, 'x', -speed, "left");
    //         }
    //         if (ArrowRight) {
    //             this.movePlayer(player, 'x', speed, "right");
    //         }
    // }

    handlePlayerMovement(player, game) {
        if (!player.input) return;

        const input = player.input;
        const now = Date.now();

        // Start movement time if any key is pressed
        if (!player.movementStart && (input.ArrowUp || input.ArrowDown || input.ArrowLeft || input.ArrowRight)) {
            player.movementStart = now;
        }

        // Stop movement time if no keys are pressed
        if (
            !input.ArrowUp &&
            !input.ArrowDown &&
            !input.ArrowLeft &&
            !input.ArrowRight
        ) {
            player.movementStart = null;
            player.shift = 0;
            return;
        }

        // Update shift based on how long they've been holding
        if (player.movementStart) {
            const elapsed = now - player.movementStart;
            const progress = Math.min(elapsed / player.acceleration, player.maxSpeed); // 0–1 over 1000ms
            const base = 0.1;
            player.shift = (base + (1 - base) * Math.pow(progress, 1.5));
        }

        const speed = player.speed;

        if (input.ArrowUp) {
            this.movePlayer(player, 'y', -speed, "up", game);
        }
        if (input.ArrowDown) {
            this.movePlayer(player, 'y', speed, "down", game);
        }
        if (input.ArrowLeft) {
            this.movePlayer(player, 'x', -speed, "left", game);
        }
        if (input.ArrowRight) {
            this.movePlayer(player, 'x', speed, "right", game);
        }
    }

    movePlayer(player, axis, speed, direction, game) {
        const distance = speed * player.shift;
        const newPosition = player.pos[axis] + distance;
        // player.pos[axis] = clamp(0, newPosition, player.maxPosition[axis]);

        const playerSize = player.size?.width || 20;

        let testX = player.pos.x;
        let testY = player.pos.y;

        if (axis === 'x') {
            testX = newPosition;
        } else {
            testY = newPosition;
        }

        if (this.wouldCollideWithWalls(testX, testY, playerSize, game)) {
            return;
        }

        player.pos[axis] = clamp(0, newPosition, player.maxPosition[axis]);
        player.direction = direction;
    }

    wouldCollideWithWalls(x, y, playerSize, game) {
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
            x: Math.floor((x + playerSize - 1) / TILE_SIZE),
            y: Math.floor((y + playerSize - 1) / TILE_SIZE)
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

    handlePlayerRespawning({deadPlayers, players}, currentTime) {

        for (let playerID in deadPlayers) {
            const player = players[playerID];

                if (player.canRespawn(currentTime)) {
                    player.hp = 100;
                    player.status.alive = true;
                    player.pos = { x: 100, y: 100 };

                    delete deadPlayers[playerID];
                }
        }
    }

    handlePlayerRespawnTimer(player, currentTime) {
        if (!player.status.alive) {
            player.respawnTimer = Math.max(0, player.deathCooldown - (currentTime - player.deathTime));
            // console.log("Respawn timer: ", player.respawnTimer);
        } else {
            player.respawnTimer = null;
        }
    }


    handlePlayerShooting(player, currentTime, game) {
        // console.log("player.input.space: ", player.input.space);
        if (player.input && player.input.space === true && player.status.alive) {
            if (player.canShoot(currentTime)) {
                this.#gameService.createBulletAt(player.pos.x, player.pos.y, player.direction, game, player.size.width);
                player.lastBulletShotAt(currentTime);
            }
        }
    }
}

