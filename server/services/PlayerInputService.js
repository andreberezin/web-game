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

    handlePlayerMovement(player) {
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
            this.movePlayer(player, 'y', -speed, "up");
        }
        if (input.ArrowDown) {
            this.movePlayer(player, 'y', speed, "down");
        }
        if (input.ArrowLeft) {
            this.movePlayer(player, 'x', -speed, "left");
        }
        if (input.ArrowRight) {
            this.movePlayer(player, 'x', speed, "right");
        }
    }

    movePlayer(player, axis, speed, direction) {
        const distance = speed * player.shift;
        const newPosition = player.position[axis] + distance;
        // player.pos[axis] = clamp(0, newPosition, player.maxPosition[axis]);

        player.position[axis] = clamp(0, newPosition, player.maxPosition[axis]);
        player.direction = direction;
    }

    handlePlayerRespawning({deadPlayers, players}, currentTime) {

        for (let playerID in deadPlayers) {
            const player = players[playerID];

                if (player.canRespawn(currentTime)) {
                    player.hp = 100;
                    player.status.alive = true;
                    player.position = { x: 100, y: 100 };

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
                this.#gameService.createBulletAt(player.position.x, player.position.y, player.direction, game, player.size.width);
                player.lastBulletShotAt(currentTime);
            }
        }
    }
}

