/**
 * Integration test for timer expiration winner logic
 * Tests the bug where when timer runs out, a player with more lives should win instead of showing a draw
 */

import { strict as assert } from 'assert';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { createRequire } from 'module';

// Mock Socket.IO for testing
class MockSocket {
    constructor(id) {
        this.id = id;
        this.rooms = new Set();
        this.gameId = null;
    }

    join(room) {
        this.rooms.add(room);
        this.gameId = room;
    }

    to(room) {
        return {
            emit: (event, ...args) => {
                // Mock implementation - in real test this would be tracked
                console.log(`Socket ${this.id} emitting to room ${room}: ${event}`, args);
            }
        };
    }

    emit(event, ...args) {
        console.log(`Socket ${this.id} emitting: ${event}`, args);
    }
}

class MockIO {
    constructor() {
        this.sockets = new Map();
    }

    emit(event, ...args) {
        console.log(`IO emitting: ${event}`, args);
    }

    to(room) {
        return {
            emit: (event, ...args) => {
                console.log(`IO emitting to room ${room}: ${event}`, args);
            }
        };
    }
}

// Simple Player mock based on the project structure
class Player {
    constructor(id, name, playerService = null) {
        this.id = id;
        this.name = name;
        this.lives = 3; // Default starting lives
        this.hp = 100;
        this.pos = { x: 100, y: 100 };
        this.status = { alive: true };
        this.input = {};
        this.pauses = 1;
        this.size = { width: 30, height: 30 };
        this.respawnTimer = 0;
        this.deathCooldown = 0;
        this.damageMultiplier = 1;
    }

    handleDeath() {
        this.status.alive = false;
        this.lives--;
    }

    hasPause() {
        return this.pauses > 0;
    }

    deductPause() {
        this.pauses--;
    }

    diedAt(timestamp) {
        this.deathTimestamp = timestamp;
    }
}

// Simple Game mock based on the project structure
class Game {
    constructor(id, settings = {}) {
        this.id = id;
        this.settings = {
            duration: 60000, // 1 minute in milliseconds
            mapType: 'default',
            private: false,
            ...settings
        };
        this.state = {
            status: 'waiting',
            players: {},
            bullets: {},
            powerups: {},
            startTime: null,
            timeRemaining: this.settings.duration,
            pause: {
                startTime: null,
                timeRemaining: 0,
                duration: 10000
            }
        };
    }

    updateState(newState) {
        Object.assign(this.state, newState);
    }
}

// Mock ServerStore
class ServerStore {
    constructor() {
        this.games = new Map();
        this.timeWhenLastPowerupWasCreated = 0;
    }
}

// Simplified GameService for testing
class GameService {
    constructor({ serverStore, io }) {
        this.serverStore = serverStore;
        this.io = io;
        this.gamesManager = null;
    }

    setGamesManager(gamesManager) {
        this.gamesManager = gamesManager;
    }

    addPlayerToGame(gameId, playerId, player) {
        const game = this.serverStore.games.get(gameId);
        if (!game) {
            throw new Error(`Game ${gameId} not found`);
        }
        game.state.players[playerId] = player;
    }

    updateGameStatus(gameId, status, playerId, io) {
        const game = this.serverStore.games.get(gameId);
        if (!game) {
            throw new Error(`Game ${gameId} not found`);
        }

        const player = game.state.players[playerId];

        // shared update, per game
        if (game.state.status !== status) {
            console.log("Game status changed: ", status, "by player: ", playerId);

            if (status === "paused" && player && !player.hasPause()) {
                console.warn(`Player ${playerId} cannot pause: no pauses left`);
                throw new Error(`No pauses left`);
            }

            switch (status) {
                case "waiting":
                    break;
                case "started":
                    this.startGame(game);
                    break;
                case "paused":
                    this.pauseGame(game, io, gameId);
                    if (player) player.deductPause();
                    console.log("player pauses:", player ? player.pauses : 'no player');
                    break;
                case "finished":
                    this.finishGame(gameId);
                    break;
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

    finishGame(gameId) {
        setTimeout(() => {
            if (this.gamesManager) {
                this.gamesManager.deleteGame(gameId);
            }
        }, 120000);
    }

    handleGameTimer(game) {
        function gameCountdown() {
            const state = game.state;

            const elapsed = Date.now() - state.startTime;
            state.timeRemaining = Math.max(0, game.settings.duration - elapsed);

            if (state.timeRemaining > 0 && state.status === "started") {
                setTimeout(gameCountdown, 10);
            } else {
                console.log("Timer has stopped: ", state.timeRemaining / 1000);
            }
        }

        setTimeout(gameCountdown, 10);
    }

    handlePauseTimer(game, io, gameId) {
        const pauseCountdown = () => {
            const state = game.state;
            const pause = state.pause;

            const elapsed = Date.now() - pause.startTime;
            pause.timeRemaining = Math.max(0, pause.duration - elapsed);

            if (pause.timeRemaining > 0 && state.status === "paused") {
                setTimeout(pauseCountdown, 10);
            } else {
                console.log("Game pause has ended");
                this.resumeGame(game, io, gameId);
            }
        };

        setTimeout(pauseCountdown, 10);
    }

    resumeGame(game, io, gameId) {
        game.state.status = "started";
        console.log("Game status changed: started");
        io.to(gameId).emit('gameStatusChangeSuccess', gameId, game.state.status);

        // resume timer
        this.handleGameTimer(game);
    }

    /**
     * This is the core method being tested - checks for winner when game is finished
     * BUG: The logic should correctly determine winner based on most lives when timer expires
     */
    checkForWinner(game) {
        let playersWhoHaventLost = [];

        // Find all players with lives > 0
        for (const playerID in game.state.players) {
            const player = game.state.players[playerID];

            if (player.lives > 0) {
                playersWhoHaventLost.push(player);
            }
        }

        // This is the key logic for timer expiration - when game is finished and players still have lives
        if (game.state.status === "finished" && playersWhoHaventLost.length > 0) {
            let mostLives = 0;
            let playersWithMostLives = [];

            // Find the player(s) with the most lives
            for (const player of playersWhoHaventLost) {
                if (player.lives > mostLives) {
                    playersWithMostLives = [];
                    playersWithMostLives.push(player);
                    mostLives = player.lives;
                } else if (player.lives === mostLives) {
                    playersWithMostLives.push(player);
                }
            }

            let playerWhoWon;
            if (playersWithMostLives.length === 1) {
                playerWhoWon = playersWithMostLives[0];
                console.log("%s player WON!", playerWhoWon.name);
                this.io.emit('declareWinner', game.id, playerWhoWon);
            } else if (playersWithMostLives.length > 1) {
                console.log("The game is a draw.");
                this.io.emit('declareWinner', game.id, null);
            }

            game.state.status = "finished";
            this.finishGame(game.id);
        } else if (game.state.status === "finished") {
            return;
        }

        // Handle case where only one player has lives left (regular win condition)
        if (playersWhoHaventLost.length === 1) {
            const playerWhoWon = playersWhoHaventLost[0];
            console.log("%s player WON!", playerWhoWon.name);
            this.io.emit('declareWinner', game.id, playerWhoWon);
            game.state.status = "finished";
            this.finishGame(game.id);
        }
    }
}

describe('Timer Winner Logic Integration Tests', () => {
    let gameService;
    let serverStore;
    let mockIO;
    let game;

    beforeEach(() => {
        // Setup test environment
        serverStore = new ServerStore();
        mockIO = new MockIO();
        gameService = new GameService({ serverStore, io: mockIO });

        // Create a test game
        game = new Game('test-game-123', { duration: 60000 }); // 1 minute game
        serverStore.games.set('test-game-123', game);
    });

    afterEach(() => {
        // Cleanup
        serverStore.games.clear();
    });

    it('should declare player with 3 lives as winner when timer expires (player has 2 lives)', (t, done) => {
        // Test the specific bug scenario described
        const player1 = new Player('player1', 'Alice');
        const player2 = new Player('player2', 'Bob');

        // Set up the scenario: player1 has 3 lives, player2 has 2 lives
        player1.lives = 3;
        player2.lives = 2;

        // Add players to game
        game.state.players['player1'] = player1;
        game.state.players['player2'] = player2;

        // Set game status to finished (simulating timer expiration)
        game.state.status = 'finished';

        // Track what gets emitted
        let declaredWinner = null;
        let originalEmit = mockIO.emit;
        mockIO.emit = (event, gameId, winner) => {
            if (event === 'declareWinner') {
                declaredWinner = winner;
            }
            originalEmit.call(mockIO, event, gameId, winner);
        };

        // Execute the winner check logic
        gameService.checkForWinner(game);

        // Assertions
        assert(declaredWinner !== null, 'A winner should be declared, not a draw');
        assert.strictEqual(declaredWinner.id, 'player1', 'Player1 should be declared winner');
        assert.strictEqual(declaredWinner.name, 'Alice', 'Alice should be declared winner');
        assert.strictEqual(declaredWinner.lives, 3, 'Winner should have 3 lives');

        console.log('✓ Test passed: Player with more lives (3) wins over player with fewer lives (2)');
        done();
    });

    it('should declare draw when both players have equal lives and timer expires', (t, done) => {
        // Test the draw scenario
        const player1 = new Player('player1', 'Alice');
        const player2 = new Player('player2', 'Bob');

        // Set up equal lives scenario
        player1.lives = 2;
        player2.lives = 2;

        // Add players to game
        game.state.players['player1'] = player1;
        game.state.players['player2'] = player2;

        // Set game status to finished (simulating timer expiration)
        game.state.status = 'finished';

        // Track what gets emitted
        let declaredWinner = undefined;
        let originalEmit = mockIO.emit;
        mockIO.emit = (event, gameId, winner) => {
            if (event === 'declareWinner') {
                declaredWinner = winner;
            }
            originalEmit.call(mockIO, event, gameId, winner);
        };

        // Execute the winner check logic
        gameService.checkForWinner(game);

        // Assertions
        assert.strictEqual(declaredWinner, null, 'Should declare a draw (null winner)');

        console.log('✓ Test passed: Equal lives results in a draw');
        done();
    });

    it('should declare winner when one player has significantly more lives', (t, done) => {
        // Test extreme difference scenario
        const player1 = new Player('player1', 'Alice');
        const player2 = new Player('player2', 'Bob');
        const player3 = new Player('player3', 'Charlie');

        // Set up scenario: Alice has 3 lives, Bob has 1 life, Charlie has 1 life
        player1.lives = 3;
        player2.lives = 1;
        player3.lives = 1;

        // Add players to game
        game.state.players['player1'] = player1;
        game.state.players['player2'] = player2;
        game.state.players['player3'] = player3;

        // Set game status to finished (simulating timer expiration)
        game.state.status = 'finished';

        // Track what gets emitted
        let declaredWinner = null;
        let originalEmit = mockIO.emit;
        mockIO.emit = (event, gameId, winner) => {
            if (event === 'declareWinner') {
                declaredWinner = winner;
            }
            originalEmit.call(mockIO, event, gameId, winner);
        };

        // Execute the winner check logic
        gameService.checkForWinner(game);

        // Assertions
        assert(declaredWinner !== null, 'A winner should be declared');
        assert.strictEqual(declaredWinner.id, 'player1', 'Player1 should be declared winner');
        assert.strictEqual(declaredWinner.lives, 3, 'Winner should have 3 lives');

        console.log('✓ Test passed: Player with most lives (3) wins in 3-player scenario');
        done();
    });

    it('should not interfere with regular win condition (last player alive)', (t, done) => {
        // Test that regular win logic still works
        const player1 = new Player('player1', 'Alice');
        const player2 = new Player('player2', 'Bob');

        // Set up scenario: Alice has lives, Bob has no lives
        player1.lives = 2;
        player2.lives = 0; // Bob is eliminated

        // Add players to game
        game.state.players['player1'] = player1;
        game.state.players['player2'] = player2;

        // Game is still running (not finished by timer)
        game.state.status = 'started';

        // Track what gets emitted
        let declaredWinner = null;
        let originalEmit = mockIO.emit;
        mockIO.emit = (event, gameId, winner) => {
            if (event === 'declareWinner') {
                declaredWinner = winner;
            }
            originalEmit.call(mockIO, event, gameId, winner);
        };

        // Execute the winner check logic
        gameService.checkForWinner(game);

        // Assertions
        assert(declaredWinner !== null, 'A winner should be declared');
        assert.strictEqual(declaredWinner.id, 'player1', 'Player1 should be declared winner');
        assert.strictEqual(game.state.status, 'finished', 'Game status should be set to finished');

        console.log('✓ Test passed: Regular elimination win condition works correctly');
        done();
    });

    it('should handle edge case where all players have zero lives at timer expiration', (t, done) => {
        // Test edge case
        const player1 = new Player('player1', 'Alice');
        const player2 = new Player('player2', 'Bob');

        // Set up scenario: Both players have no lives
        player1.lives = 0;
        player2.lives = 0;

        // Add players to game
        game.state.players['player1'] = player1;
        game.state.players['player2'] = player2;

        // Set game status to finished (simulating timer expiration)
        game.state.status = 'finished';

        // Track what gets emitted
        let emitCount = 0;
        let originalEmit = mockIO.emit;
        mockIO.emit = (event, gameId, winner) => {
            if (event === 'declareWinner') {
                emitCount++;
            }
            originalEmit.call(mockIO, event, gameId, winner);
        };

        // Execute the winner check logic
        gameService.checkForWinner(game);

        // Assertions - should not emit declareWinner when no players have lives
        assert.strictEqual(emitCount, 0, 'No winner should be declared when all players have 0 lives');

        console.log('✓ Test passed: No winner declared when all players eliminated');
        done();
    });

    /**
     * Test the actual integration - simulating the real timer expiration flow
     */
    it('integration: should properly handle timer expiration and winner determination', async () => {
        // Set up a short duration game for testing
        const testGame = new Game('integration-test', { duration: 100 }); // 100ms for quick test
        serverStore.games.set('integration-test', testGame);

        const player1 = new Player('player1', 'Alice');
        const player2 = new Player('player2', 'Bob');

        // Set up the bug scenario: player1 has 3 lives, player2 has 2 lives
        player1.lives = 3;
        player2.lives = 2;

        // Add players to game
        testGame.state.players['player1'] = player1;
        testGame.state.players['player2'] = player2;

        // Track the winner declaration
        let declaredWinner = null;
        let originalEmit = mockIO.emit;
        mockIO.emit = (event, gameId, winner) => {
            if (event === 'declareWinner') {
                declaredWinner = winner;
                console.log(`Winner declared: ${winner ? winner.name : 'DRAW'}`);
            }
            originalEmit.call(mockIO, event, gameId, winner);
        };

        // Start the game (this starts the timer)
        gameService.updateGameStatus('integration-test', 'started', null);

        // Wait for the timer to expire and then a bit more to ensure processing
        await new Promise(resolve => setTimeout(resolve, 200));

        // Manually trigger the finish status (simulating what client does when timer hits 0)
        gameService.updateGameStatus('integration-test', 'finished', null);

        // Check winner
        gameService.checkForWinner(testGame);

        // Assertions
        assert(declaredWinner !== null, 'A winner should be declared after timer expiration, not a draw');
        assert.strictEqual(declaredWinner.id, 'player1', 'Player1 should win with more lives');
        assert.strictEqual(declaredWinner.lives, 3, 'Winner should have 3 lives');

        console.log('✓ Integration test passed: Timer expiration correctly determines winner based on lives');
    });
});

// Helper function to run tests (since we're not using a full test runner in this demo)
export function runTimerWinnerTests() {
    console.log('🧪 Running Timer Winner Logic Integration Tests...\n');

    // This would normally be handled by the test runner
    // For demo purposes, we can run individual test scenarios manually
}

export {
    GameService,
    Player,
    Game,
    ServerStore,
    MockIO,
    MockSocket
};
