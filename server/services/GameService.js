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

        // todo refactor so this function iterates over game.state.players and then applies all these next functions. Currently all these functions iterate over game.state.players over and over again
        this.playerInputService.handlePlayerMovement(game);
        this.playerInputService.handlePlayerShooting(game, currentTime);
        this.checkForCollisions(game, currentTime);
        this.playerInputService.handlePlayerRespawning(game, currentTime);
        // this.playerInputService.handlePlayerRespawnTimer(game, currentTime);
    }

    checkForCollisions(game, currentTime) {
        const players = game.state.players;
        const bullets = game.state.bullets;
        const bulletsToDelete = [];

        for (let playerID in players) {
            if (players[playerID].status.alive) {
                const player = players[playerID];

                for (let bulletID in bullets) {
                    const bullet = bullets[bulletID];

                    if (bullet.position.x + 5 > player.position.x && bullet.position.x < player.position.x + 20 && bullet.position.y + 5 > player.position.y && bullet.position.y < player.position.y + 20) {
                        //console.log("PLAYER GOT HIT REMOVING 20 HP");
                        player.hp = player.hp - 20;
                        if (player.hp <= 0) {
                            // Player dies if hp is 0
                            player.status.alive = false;
                            player.diedAt(currentTime);
                            game.state.deadPlayers[playerID] = player;
                            //delete game.state.players[playerID];
                        }

                        bulletsToDelete.push(bulletID);
                    }
                }
            }
        }

        bulletsToDelete.forEach(bulletID => {
            delete game.state.bullets[bulletID];
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
        const currentPlayerCount = Object.keys(game.state.players).length;
        const maxPlayersAllowed = game.settings.maxPlayers;
        return currentPlayerCount < maxPlayersAllowed;
    }

    addPlayer(game, playerId, player) {
        game.state.players[playerId] = player;
    }

    createBulletAt(x, y, direction, game) {
        const id = Math.floor(Math.random() * 10000);
        if (direction === "up") {
            game.state.bullets[id] = new Bullet(id, x, y-6, "up");
        } else if (direction === "down") {
            game.state.bullets[id] = new Bullet(id, x, y+26, "down");
        } else if (direction === "left") {
            game.state.bullets[id] = new Bullet(id, x-6, y, "left");
        } else if (direction === "right") {
            game.state.bullets[id] = new Bullet(id, x+26, y, "right");
        }
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

            this.moveBulletByVelocity(bullet, directionValues);

            if (this.isOutOfBounds(bullet.position)) {
                bulletsToDelete.push(bulletId);
            }
        });

        this.deleteBulletsOutOfBounds(bulletsToDelete, bullets);
    }

	moveBulletByVelocity(bullet, directionValues) {
            if (directionValues) {
                bullet.position[directionValues.coord] += bullet.velocity * directionValues.multiplier;
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
