import {Game} from '../models/Game.js';
import {Bullet} from "../models/Bullet.js";

export class GameService {
    #gamesManager;

    static GAME_BOUNDS = {
        MIN_X: 0,
        MAX_X: 1000,
        MIN_Y: 0,
        MAX_Y: 1000
    }

    constructor(playerInputService) {
        this.playerInputService = playerInputService;
    }

    setGamesManager(gamesManager) {
        this.#gamesManager = gamesManager;
    }

    createGame(hostId, settings) {
        return new Game(hostId, settings);
    }

    updateGameState(game) {
        this.updateBullets(game);

        this.playerInputService.handlePlayerMovement(game);
        this.playerInputService.handlePlayerShooting(game);
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
        return true;
    }

    createBulletAt(x, y, direction, game) {
        const id = Math.floor(Math.random() * 10000);
        game.getState.bullets[id] = new Bullet(id, x, y, direction);
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
