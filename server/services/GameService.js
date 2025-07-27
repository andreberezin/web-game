import Game from '../models/Game.js';
import Bullet from "../models/Bullet.js";

export default class GameService {
    #gamesManager;

    static GAME_BOUNDS = {
        MIN_X: 0,
        MAX_X: 1920,
        MIN_Y: 0,
        MAX_Y: 1080,
    }

    constructor({playerInputService}) {
        this.playerInputService = playerInputService;
    }

    setGamesManager(gamesManager) {
        this.#gamesManager = gamesManager;
    }

    createGame(hostId, settings) {
        return new Game(hostId, settings);
    }

    updateGameState(game, currentTime) {
        this.updateBullets(game);

        this.playerInputService.handlePlayerMovement(game);
        this.playerInputService.handlePlayerShooting(game, currentTime);
        this.checkForCollisions(game, currentTime);
        this.playerInputService.handlePlayerRespawning(game, currentTime);
    }

    checkForCollisions(game, currentTime) {
        const players = game.getState.players;
        const bullets = game.getState.bullets;
        const bulletsToDelete = [];

        for (let playerID in players) {
            const player = players[playerID];

            for (let bulletID in bullets) {
                const bullet = bullets[bulletID];

                if (bullet.pos.x + 5 > player.pos.x && bullet.pos.x < player.pos.x + 20 && bullet.pos.y + 5 > player.pos.y && bullet.pos.y < player.pos.y + 20) {
                    console.log("PLAYER GOT HIT REMOVING 20 HP");
                    player.setHp(player.hp - 20);
                    if (player.getHp() <= 0) {
                        // Player dies if hp is 0
                        player.setStatus("dead");
                        player.diedAt(currentTime);
                        game.getState.deadPlayers[playerID] = player;
                        delete game.getState.players[playerID];
                    }

                    bulletsToDelete.push(bulletID);
                }
            }
        }

        bulletsToDelete.forEach(bulletID => {
            delete game.getState.bullets[bulletID];
        });
    }

    addPlayerToGame(gameId, playerId, player) {
        const game = this.#gamesManager.games.get(gameId);
        if (!game) {
            throw new Error("Game not found, cannot add player");
        }

        return this.canAddPlayer(game)
            ? this.addPlayer(game, playerId, player)
            : false;
    }

    canAddPlayer(game) {
        const currentPlayerCount = Object.keys(game.getState.players).length;
        const maxPlayersAllowed = game.getSettings.maxPlayers;
        return currentPlayerCount < maxPlayersAllowed;
    }

    addPlayer(game, playerId, player) {
        game.getState.players[playerId] = player;
    }

    createBulletAt(x, y, direction, game) {
        const id = Math.floor(Math.random() * 10000);
        if (direction === "up") {
            game.getState.bullets[id] = new Bullet(id, x, y-6, "up");
        } else if (direction === "down") {
            game.getState.bullets[id] = new Bullet(id, x, y+26, "down");
        } else if (direction === "left") {
            game.getState.bullets[id] = new Bullet(id, x-6, y, "left");
        } else if (direction === "right") {
            game.getState.bullets[id] = new Bullet(id, x+26, y, "right");
        }
    }

    updateBullets(game) {
        const bullets = game.getState.bullets;
        const directionMap = {
            "up": {coord: "y", multiplier: -1},
            "down": {coord: "y", multiplier: 1},
            "left": {coord: "x", multiplier: -1},
            "right": {coord: "x", multiplier: 1}
        }
        const bulletsToDelete = [];

        Object.entries(bullets).forEach(([bulletId, bullet]) => {
            const directionValues = directionMap[bullet.direction];

            this.moveBulletByVelocity(bullet, directionValues);

            if (this.isOutOfBounds(bullet.pos)) {
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
        const { MIN_X, MAX_X, MIN_Y, MAX_Y } = GameService.GAME_BOUNDS;
        return pos.y < MIN_Y || pos.y > MAX_Y || pos.x < MIN_X || pos.x > MAX_X;
    }
}
