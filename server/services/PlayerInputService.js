import {clamp} from '../utils/clamp.js';

export default class PlayerInputService {

    #gameService;

    constructor() {}

    setGameService(gameService) {
        this.#gameService = gameService;
    }

    handlePlayerMovement(game) {
        for (let playerID in game.state.players) {
            const player = game.state.players[playerID]

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
        const newPosition = player.position[axis] + distance;
        // player.pos[axis] = clamp(0, newPosition, player.maxPosition[axis]);

        player.position[axis] = clamp(0, newPosition, player.maxPosition[axis]);
        player.direction = direction;
    }

    handlePlayerRespawning(game, currentTime) {

        const deadPlayers = game.state.deadPlayers;
        const alivePlayers = game.state.players

        for (let playerID in deadPlayers) {
            const player = alivePlayers[playerID];

                if (player.canRespawn(currentTime)) {
                    player.hp = 100;
                    player.status.alive = true;
                    player.position = { x: 100, y: 100 };

                    // todo does this next line do anything?
                   // game.state.players[playerID] = player;
                    delete game.state.deadPlayers[playerID];
                }
        }
    }

    handlePlayerRespawnTimer(game, currentTime) {
        const players = game.state.players;

        for (let playerID in players) {
            const player = players[playerID];

            if (!player.status.alive) {
                player.respawnTimer = Math.max(0, player.deathCooldown - (currentTime - player.deathTime));
                // console.log("Respawn timer: ", player.respawnTimer);
            } else {
                player.respawnTimer = null;
            }
        }
    }


    handlePlayerShooting(game, currentTime) {
        const players = game.state.players;

        for (let playerID in players) {
            const player = players[playerID];

            if (player.input && player.input.space === true) {
                if (player.canShoot(currentTime)) {
                    this.#gameService.createBulletAt(player.position.x, player.position.y, player.direction, game);
                    player.lastBulletShotAt(currentTime);
                }
            }
        }
    }
}

