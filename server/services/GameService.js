import Game from '../models/Game.js';
import Bullet from "../models/Bullet.js";

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

        // if (game.state.status === "started" && game.state.timeRemaining > 0) {
        //     this.handleGameTimer(game, currentTime);
        // }

        this.updateBullets(game);

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

    startGame() {

    }

    pauseGame() {

    }

    finishGame() {

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
                game.state.status = "finished"
                socket.emit('gameStatusChangeSuccess', game.id, game.state.status);
                console.log("Timer has finished: ", game.state.timeRemaining);
            }
        }

        setTimeout(countdown, 10);
    }

    checkForCollisions(player, currentTime, {bullets, deadPlayers}) {
        const bulletsToDelete = [];

            if (player.status.alive) {
                for (let bulletID in bullets) {
                    const bullet = bullets[bulletID];

                    if (bullet.pos.x + 5 > player.pos.x && bullet.pos.x < player.pos.x + 20 && bullet.pos.y + 5 > player.pos.y && bullet.pos.y < player.pos.y + 20) {
                        //console.log("PLAYER GOT HIT REMOVING 20 HP");
                        player.hp = player.hp - 20;
                        if (player.hp <= 0) {
                            // Player dies if hp is 0
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
            }

        bulletsToDelete.forEach(bulletID => {
            delete bullets[bulletID];
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

    createBulletAt(x, y, direction, game, playerWidth) {
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
        game.state.bullets[id] = new Bullet(id, bulletX, bulletY, direction);
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

            if (this.isOutOfBounds(bullet.pos)) {
                bulletsToDelete.push(bulletId);
            }
        });

        this.deleteBullets(bulletsToDelete, bullets);
    }

	moveBulletByVelocity(bullet, directionValues) {
            if (directionValues) {
                bullet.pos[directionValues.coord] += bullet.velocity * directionValues.multiplier;
            }
	}

	deleteBullets(bulletsToDelete, bullets) {
        bulletsToDelete.forEach(bulletId => {
            delete bullets[bulletId];
        });
	}

    isOutOfBounds(pos) {
        const { MIN_X, MAX_X, MIN_Y, MAX_Y } = this.#serverStore.GAME_BOUNDS;
        return pos.y < MIN_Y || pos.y > MAX_Y || pos.x < MIN_X || pos.x > MAX_X;
    }


}
