import {clamp} from '../utils/clamp.js';

export class PlayerInputService {

    #gameService;

    setGameService(gameService) {
        this.#gameService = gameService;
    }

    handlePlayerMovement(game) {
        for (let playerID in game.getState.players) {
            const player = game.getState.players[playerID]

            if (!player.input) continue;

            const {arrowUp, arrowDown, arrowLeft, arrowRight} = player.input;
            if (arrowUp) {
                this.movePlayer(player, 'y', -1, "up");
            }
            if (arrowDown) {
                this.movePlayer(player, 'y', 1, "down");
            }
            if (arrowLeft) {
                this.movePlayer(player, 'x', -1, "left");
            }
            if (arrowRight) {
                this.movePlayer(player, 'x', 1, "right");
            }
        }
    }

    movePlayer(player, axis, multiplier, direction) {
        const distance = multiplier * player.shift;
        const newPosition = player.pos[axis] + distance;
        player.pos[axis] = clamp(0, newPosition, player.maxPosition[axis]);
        player.direction = direction;
    }

    handlePlayerRespawning(game, currentTime) {

        const players = game.getState.players;

        for (let playerID in players) {
            const player = players[playerID];
            if (player.getStatus() === "alive") {
                return;
            }

                if (player.canRespawn(currentTime)) {
                    this.#gameService.addPlayer(game, playerID, player);
                }
        }
    }

    handlePlayerShooting(game, currentTime) {
        const players = game.getState.players;

        for (let playerID in players) {
            const player = players[playerID];

            if (player.input && player.input.space === true) {
                if (player.canShoot(currentTime)) {
                    this.#gameService.createBulletAt(player.pos.x, player.pos.y, player.direction, game);
                    player.lastBulletShotAt(currentTime);
                }
            }
        }
    }
}

