import {clamp} from '../utils/clamp.js';

export default class PlayerInputService {

    #gameService;

    constructor() {}

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

        const deadPlayers = game.getState.deadPlayers;

        for (let playerID in deadPlayers) {
            const player = deadPlayers[playerID];

                if (player.canRespawn(currentTime)) {
                    player.setHp(100);
                    player.setStatus("alive");
                    player.pos = { x: 100, y: 100 };

                    game.getState.players[playerID] = player;
                    delete game.getState.deadPlayers[playerID];
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

