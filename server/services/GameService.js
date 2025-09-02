import Game from '../models/Game.js';
import DestroyableWall from "../models/DestroyableWall.js";

export default class GameService {
    #playerInputService;
    #serverStore;
    #bulletService;
    #powerupService;
    #gamesManager;
    #playerService
    #io

    constructor({playerInputService, serverStore, bulletService, powerupService, playerService, io}) {
        this.#playerInputService = playerInputService;
        this.#serverStore = serverStore;
        this.#bulletService = bulletService;
        this.#powerupService = powerupService;
        this.#playerService = playerService;
        this.#io = io;
    }

    setGamesManager(gamesManager) {
        this.#gamesManager = gamesManager;
    }

    createGame(hostId, settings) {
        return new Game(hostId, settings);
    }

    canCreateGame(gameId) {
        return !this.#serverStore.games.has(gameId);
    }

    updateGameState(game, currentTime) {
        const status = game.state.status;

        if (status !== "paused" && status !== "waiting") {
            this.#bulletService.updateBullets(game);
            this.#powerupService.updatePowerups(game, currentTime);
        }

        if (status === "started") {
            for (const playerID in game.state.players) {
                const player = game.state.players[playerID];

                this.#powerupService.updatePlayerPowerups(player, currentTime);
                this.#playerInputService.handlePlayerMovement(player, game);
                this.#playerInputService.handlePlayerShooting(player, currentTime, game);
                this.checkForCollisions(player, currentTime, game.state, game);
                this.#playerInputService.handlePlayerRespawning(game.state, currentTime);
                this.#playerInputService.handlePlayerRespawnTimer(player, currentTime);
            }

            this.checkForWinner(game);
        }
    }

    updateGameStatus(gameId, status, playerId, io) {

        const game = this.#serverStore.games.get(gameId);
        if (!game) {
            throw new Error(`Game ${gameId} not found`);
        }

        const player = game.state.players[playerId];

        // shared update, per game
        if (game.state.status !== status) {
            console.log("Game status changed: ", status, "by player: ", playerId);

            if (status === "paused" && !player.hasPause()) {
                console.warn(`Player ${playerId} cannot pause: no pauses left`);
                throw new Error(`No pauses left`);
            }

            switch (status) {
            case "waiting":
                if (game.state.status === "paused") {
                    this.restartGame(gameId);
                }
                break;
            case "started":
                this.startGame(game);
                break;
            case "paused":
                this.pauseGame(game, io, gameId);
                player.deductPause();
                console.log("player pauses:", player.pauses);
                break;
            case "finished": {
                let playersWhoHaventLost = [];

                for (const playerID in game.state.players) {
                    const player = game.state.players[playerID];

                    if (player.lives > 0) {
                        playersWhoHaventLost.push(player);
                    }
                }

                if (playersWhoHaventLost.length > 0) {
                    let mostScore = 0;
                    let playersWithMostScore = [];
                    for (const player of playersWhoHaventLost) {
                        if (player.score > mostScore) {
                            playersWithMostScore = [];
                            playersWithMostScore.push(player);
                            mostScore = player.score;
                        } else if (player.score === mostScore) {
                            playersWithMostScore.push(player);
                        }
                    }
                    let playerWhoWon;
                    if (playersWithMostScore.length === 1) {
                        playerWhoWon = playersWithMostScore[0];
                        console.log("%s player WON!", playerWhoWon.name);
                        this.#io.emit('declareWinner', game.id, playerWhoWon);
                    } else if (playersWithMostScore.length > 1) {
                        console.log("The game is a draw.");
                        this.#io.emit('declareWinner', game.id, null);
                    }
                }

                this.finishGame(game.id);
                break;
                }
            default:
                console.log("default: ", status);
            }

            game.state.status = status;
        }
    }

    startGame(game) {
        game.state.startTime = Date.now();
        if (game.state.timeRemaining > 0) {
            this.handleGameTimer(game);
        }
    }

    pauseGame(game, io, gameId) {
        game.updateState({pause: {
            ...game.state.pause,
            startTime: Date.now(),
            }});
        this.handlePauseTimer(game, io, gameId);
    }

    resumeGame(game, io, gameId) {
        game.state.status = "started"
        console.log("Game status changed: started");
        io.to(gameId).emit('gameStatusChangeSuccess', gameId, game.state.status);

        // resume timer
        this.handleGameTimer(game);
    }

    finishGame(gameId) {
        const game = this.#serverStore.games.get(gameId);
        if (!game) return;

        setTimeout(() => {
            // delete game state
            this.#gamesManager.deleteGame(gameId);

            // force all sockets to leave the room
            const room = this.#io.sockets.adapter.rooms.get(gameId);
            if (room) {
                for (const socketId of room) {
                    const socket = this.#io.sockets.sockets.get(socketId);
                    if (socket) {
                        // detach game listeners + leave room
                        socket.removeAllListeners('updateMyPlayerInput');
                        socket.removeAllListeners('gameStatusChange');
                        socket.removeAllListeners('leaveGame');
                        socket.leave(gameId);
                        socket.gameId = null;
                    }
                }
            }

            console.log(`Game ${gameId} fully cleaned up`);
        }, game.state.pause.duration);
    }

    checkForWinner(game) {
        let playersWhoHaventLost = [];

        for (const playerID in game.state.players) {
            const player = game.state.players[playerID];

            if (player.lives > 0) {
                playersWhoHaventLost.push(player);
            }
        }

        if (game.playersInLobby > 1 && playersWhoHaventLost.length === 1) {
            const playerWhoWon = playersWhoHaventLost[0];
            console.log("%s player WON!", playerWhoWon.name);
            this.#io.emit('declareWinner', game.id, playerWhoWon);
            game.state.status = "finished";
            this.finishGame(game.id);
        }
    }

    // todo refactor this function into smaller parts
    restartGame(gameId) {
        const game = this.#serverStore.games.get(gameId);
        if (!game) return;

        if (game.pauseTimeout) {
            clearTimeout(game.pauseTimeout);
            game.pauseTimeout = null;
        }

        // Spawn points (same as joinGame logic)
        const spawnPoints = [
            {x: 1700, y: 900}, // 2nd player
            {x: 100, y: 900},  // 3rd player
            {x: 1700, y: 100}  // 4th player
        ];

        // Reset players
        let i = 0;
        for (const playerId in game.state.players) {
            const player = game.state.players[playerId];
            player.hp = 100;
            player.lives = 3;
            player.kills = 0;
            player.score = 0;

            // Assign spawn based on order
            if (i === 0) {
                player.pos = { x: 100, y: 100 }; // host / first player
            } else {
                player.pos = spawnPoints[i - 1] || { x: 100, y: 100 }; // fallback if >4 players
            }

            player.pauses = 2;
            player.status.alive = true;
            player.damageMultiplier = 1;

            i++;
        }

        // Reset bullets, powerups, etc.
        game.state.status = "waiting";
        game.state.pause = { startTime: null, duration: 10000, timeRemaining: 0 };
        game.state.bullets = {};
        game.state.powerups = {};
        game.state.deadPlayers = {};
        game.state.timeRemaining = game.settings.duration;
        game.state.startTime = null;

        console.log(`Game ${gameId} restarted`);
    }
    handlePauseTimer(game, io, gameId) {
        const pauseCountdown = () => {
            const state = game.state;
            const pause = state.pause;

            const currentGame = this.#serverStore.games.get(gameId);
            if (!currentGame) return;

            const elapsed = Date.now() - pause.startTime;
            pause.timeRemaining = Math.max(0, pause.duration - elapsed);

            if (pause.timeRemaining > 0 && state.status === "paused") {
                game.pauseTimeout = setTimeout(pauseCountdown, 10);
            } else {
                console.log("Game pause has ended");
                this.resumeGame(game, io, gameId);
            }
        };

        game.pauseTimeout = setTimeout(pauseCountdown, 10);
    }r

    // todo there's a delay between game status change and timer starting. Possibly call this logic in socketHandler instead straight after changing the game status?
    handleGameTimer(game) {
        const gameCountdown = () => {
            const state = game.state;

            const elapsed = Date.now() - state.startTime;
            state.timeRemaining = Math.max(0, game.settings.duration - elapsed);
            //console.log("Time remaining:", game.state.timeRemaining);

            if (state.timeRemaining <= 0) {
                this.updateGameStatus(game.id, "finished", null, this.#io)
            }

            if (state.timeRemaining > 0 && state.status === "started") {
                setTimeout(gameCountdown, 10)
            } else {
                // todo logs randomly
                console.log("Timer has stopped: ", state.timeRemaining / 1000);
            }
        }

        setTimeout(gameCountdown, 10);
    }

    checkForCollisions(player, currentTime, {bullets, deadPlayers, powerups}, game) {
        const bulletsToDelete = [];
        const powerupsToDelete = [];

            if (player.status.alive) {
                for (let bulletID in bullets) {
                    const bullet = bullets[bulletID];

                    const deltaTime = Math.min(1/60, 0.016);
                    const movementDistance = bullet.velocityPerSecond * deltaTime;

                    let bulletEndX = bullet.pos.x + movementDistance * bullet.direction.x;
                    let bulletEndY = bullet.pos.y + movementDistance * bullet.direction.y;

                    // console.log(`Checking collision: bullet at (${bullet.pos.x}, ${bullet.pos.y}) -> (${bulletEndX}, ${bulletEndY}), movement: ${movementDistance}`);

                    if (this.raycastToPlayer(bullet.pos.x, bullet.pos.y, bulletEndX, bulletEndY, bullet, player)) {
                        console.log(`${player.name} hit`);
                        player.hp = player.hp - 20 * bullet.damageMultiplier;
                        if (player.hp <= 0) {
                            this.#io.emit('playerDeath', { gameId: game.id, playerId: player.id, killerId: bullet.shooterId });
                            player.handleDeath();
                            player.diedAt(currentTime);
                            deadPlayers[player.id] = player;

                            const killer = game.state.players[bullet.shooterId];
                            if (killer && killer.id !== player.id) {
                                killer.kills += 1;
                                killer.score += 1;
                                console.log(`${killer.name} killed ${player.name}`);
                            }

                        }

                        bulletsToDelete.push(bulletID);
                    }
                }

                for (let powerupID in powerups) {
                    const powerup = powerups[powerupID];

                    if (powerup.pos.x + 10 > player.pos.x && powerup.pos.x < player.pos.x + 20 && powerup.pos.y + 10 > player.pos.y && powerup.pos.y < player.pos.y + 20) {
                        powerup.givePowerup(player, currentTime);
                        this.#io.to(player.id).emit('powerupNotification', {
                            playerId: player.id,
                            powerupType: powerup.typeOfPowerup,
                            powerupId: powerupID,
                            gameId: game.id
                        });
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
            throw new Error("Game not found");
        }

        if (this.doesPlayerExistInGame(game, playerId)) {
            throw new Error("Player already exists in game");
        }

        if (this.doesPlayerNameExistInGame(player.name, game)) {
            throw new Error(`Player name '${player.name}' is already taken`);
        }

        if (this.isGameFull(game)) {
            throw new Error("Game is full, cannot add more players");
        }

        this.addPlayer(game, playerId, player);
        return game;
    }

    doesPlayerNameExistInGame(playerName, game) {
        return Object.values(game.state.players).some(p => p.name === playerName);
    }

    isGameFull(game) {
        const currentPlayerCount = Object.keys(game.state.players).length;
        const maxPlayersAllowed = game.settings.maxPlayers;
        return currentPlayerCount >= maxPlayersAllowed;
    }

    doesPlayerExistInGame(game, playerId) {
        return Object.hasOwnProperty.call(game.state.players, playerId);
    }

    addPlayer(game, playerId, player) {
        game.state.players[playerId] = player;
    }

    removePlayer(game, playerId) {
        if (!game || !game.state.players[playerId]) {
            return false; // nothing removed
        }

        delete game.state.players[playerId];
        return true; // player successfully removed
    }

    raycastToWalls(startX, startY, endX, endY, objectSize, game) {
        const steps = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
        const stepSize = Math.max(1, Math.floor(steps / 10));

        for(let step = 0; step <= steps; step += stepSize) {
            const t = step / steps;
            const checkX = startX + (endX - startX) * t;
            const checkY = startY + (endY - startY) * t;

            if(this.wouldCollideWithWalls(checkX, checkY, objectSize, game)) {
                return true;
            }
        }

        return false;
    }

    raycastToPlayer(bulletStartX, bulletStartY, bulletEndX, bulletEndY, bullet, player) {
        const steps = Math.max(Math.abs(bulletEndX - bulletStartX), Math.abs(bulletEndY - bulletStartY));
        const stepSize = Math.max(1, Math.floor(steps / 10));

        for(let step = 0; step <= steps; step += stepSize) {
            const t = step / steps;
            const checkX = bulletStartX + (bulletEndX - bulletStartX) * t;
            const checkY = bulletStartY + (bulletEndY - bulletStartY) * t;

            if (this.wouldCollideWithPlayer(checkX, checkY, bullet, player)) {
                return true;
            }
        }

        return false;
    }

    wouldCollideWithPlayer(checkX, checkY, bullet, player) {
        return !!(checkX + 5 > player.pos.x && checkX < player.pos.x + 20 && checkY + 5 > player.pos.y && checkY < player.pos.y + 20);
    }

    wouldCollideWithWalls(x, y, objectSize, game) {
        if (!game || !game.map) {
            return false;
        }

        const TILE_SIZE = 40;
        const TILES_X = 48;

        // convert pixel coordinates to tile coordinates
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
                if (this.getTileAt(game.map, tileX, tileY, TILES_X, game)) {
                    return true;
                }
            }
        }

        return false;
    }

    getTileAt(mapArray, tileX, tileY, tilesX, game) {
        if (tileX < 0 || tileX >= tilesX || tileY < 0) {
            return true;
        }

        const index = tileY * tilesX + tileX;

        if (index >= mapArray.length) {
            return true;
        }

        if (mapArray[index] === 1) {
            return true;
        } else if (mapArray[index] === 2) {
            let destroyableWall = game.state.mapOfDestroyableWalls[index];
            if (!destroyableWall) {
                return false;
            }
            destroyableWall.hp = destroyableWall.hp - 5;
            if (destroyableWall.hp <= 0) {
                delete game.state.mapOfDestroyableWalls[index];
            }
            return true;
        }
    }

    generateWalls(game) {
        for (let i = 0; i < game.map.length; i++) {
            if (game.map[i] !== 2) continue;
            game.state.mapOfDestroyableWalls[i] = new DestroyableWall(i);
        }
    }
}
