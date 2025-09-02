# Cube Wars - Multiplayer Web Game 🎮

A real-time multiplayer web browser game built without Canvas API, supporting 2-4 players in competitive action gameplay. Players control characters in a shared game field, competing for survival while collecting power-ups and battling opponents.

## 🎯 Game Overview

**Cube Wars** is a competitive multiplayer shooter game where players:
- Control characters using keyboard and mouse
- Battle against 2-4 other players in real-time
- Collect power-ups for advantages
- Survive until the timer runs out or be the last player standing
- Compete for the highest score based on kills and survival

### Game Features
- ✅ **Real-time multiplayer** - Up to 4 players simultaneously
- ✅ **DOM-based rendering** - No Canvas API, pure DOM elements
- ✅ **Smooth 60 FPS gameplay** - Optimized with RequestAnimationFrame
- ✅ **Sound effects** - Audio feedback for game events
- ✅ **Power-up system** - Temporary advantages like damage boosts
- ✅ **Destructible environment** - Walls that can be destroyed
- ✅ **In-game menu system** - Pause, resume, quit functionality
- ✅ **Real-time scoring** - Live score updates for all players
- ✅ **Game timer** - Countdown or elapsed time display
- ✅ **Responsive controls** - Smooth keyboard/mouse input handling

## 🏗️ Project Structure

```
web-game/
├── client/                # React frontend
│   ├── components/        # React components
│   │   └── menu/          # Menu components (lobby, instructions, etc.)
│   ├── core/              # Core client logic
│   ├── di/                # Dependency injection logic
│   ├── models/            # Client-side game models
│   ├── public/            # Images and sounds
│   ├── services/          # Client game services
│   ├── sockets/           # Socket.IO client handler
│   ├── stores/            # In-memory data storage logic
│   ├── styles/            # SCSS stylesheets
│   ├── utils/             # Utility functions
│   └── package.json       # Client dependencies
├── server/                # Node.js backend
│   ├── core/              # Core backend logic
│   ├── di/                # Dependency injection container
│   ├── models/            # Server-side game models
│   ├── services/          # Server game logic services
│   ├── sockets/           # Socket.IO server handler
│   ├── stores/            # In-memory data storage logic
│   ├── test/              # Unit tests
│   ├── utils/             # Utility functions
│   └── package.json       # Server dependencies
├── package.json           # Root package.json with scripts
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web-game
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```
   This will automatically install dependencies for both client and server.

3. **Start the development servers**
   ```bash
   npm run dev
   ```
   This starts both the server (port 3000) and client (port 5173) concurrently.

4. **Open your browser**
   Navigate to `http://localhost:5173` to access the game.

### Alternative Start Methods

**Development with host access** (for local network testing):
```bash
npm run dev:host
```

**Individual servers:**
```bash
# Start only the server
npm run server

# Start only the client
npm run client
```

## 🎮 How to Play

### Getting Started
1. Open your browser and navigate to the game URL
2. Enter your player name (3-10 characters)
3. Either:
   - **Create a game** - Set up a new game room
   - **Join a game** - Enter an existing game room

### Controls
- **Movement**: WASD keys or Arrow keys
- **Aim**: Mouse cursor
- **Shoot**: Left mouse click
- **Fullscreen**: Ctrl + F

### Game Mechanics
- **Lives**: Each player starts with 3 lives
- **Health**: Players have HP that depletes when hit
- **Scoring**: Earn points for kills and remaining lives
- **Power-ups**: Collect power-ups for temporary advantages
- **Timer**: Game ends when timer expires or one player remains
- **Walls**: Some walls can be destroyed by shooting

### Winning Conditions
- **Timer expires**: Player with highest score wins
- **Last survivor**: Last living player wins
- **Score calculation**: Kills + remaining lives = total score

## 🛠️ Technical Details

### Architecture
- **Client**: React 19 with Vite bundler
- **Server**: Node.js with Express
- **Real-time Communication**: Socket.IO
- **Styling**: SASS/SCSS
- **Game Loop**: RequestAnimationFrame for smooth 60 FPS
- **Dependency Injection**: Awilix container pattern

### Key Technologies
- **Frontend**: React 19, Socket.IO Client, React Icons, Vite
- **Backend**: Express, Socket.IO, CORS
- **Development**: Nodemon, ESLint, Concurrently
- **Testing**: Node.js built-in test runner

### Performance Features
- DOM-based rendering (no Canvas API)
- Optimized game loop with RequestAnimationFrame
- Minimal layer usage for better performance
- Collision detection system
- Efficient state management

## 🔧 Configuration

### Environment Variables
`.env` files in the root, server and client directory include ports:

```env
EXPRESS_PORT=3000
VITE_PORT=5173
```

### Game Settings
Game settings can be configured when creating a game:
- **Max Players**: 2-4 players
- **Game Duration**: 1-2 minutes (configurable)
- **Private/Public**: Toggle game visibility

## 🧪 Testing

The project includes integration tests for game logic, particularly timer and winner determination functionality.

## 🌐 Network Play

### Local Network
To play across devices on the same network:
```bash
npm run dev:host
```
Then connect using your local IP address.

### Public Internet (Advanced)
The project includes ngrok integration for public internet play:
```bash
npm run dev:ngrok
```
Requires ngrok configuration and appropriate environment variables.
[Getting startd with ngrok.](https://ngrok.com/docs/getting-started/)

## 📋 Development Scripts

| Script | Description |
|--------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start both client and server |
| `npm run dev:host` | Start with network access |
| `npm run dev:debug` | Start with debugger |
| `npm run server` | Start only server |
| `npm run client` | Start only client |
| `npm run lint` | Run ESLint |
| `npm test` | Run test suite |

## 👥 Game Rules & Features

### Multiplayer Support
- **2-4 players** per game room
- **Real-time synchronization** across all clients
- **Host controls** for starting games
- **Automatic cleanup** when players disconnect

### Scoring System
- **1 point** per kill
- **1 point** per remaining life at game end
- **Real-time score updates** visible to all players
- **Winner announcement** at game completion

### Power-up System
- **Damage boost** - Increases bullet damage
- **Timed effects** - Power-ups expire after duration
- **Random spawning** - Power-ups appear periodically
- **Strategic collection** - Adds tactical gameplay layer

## 🔮 Future Enhancements

Potential features for future development:
- Additional map types and layouts
- More power-up varieties
- Player customization options
- Tournament/bracket system
- More game modes
- Spectator mode
- Voice chat support
- Mobile device support
- Enhanced visual effects

---

**Ready to battle? Start your engines and may the best cube win! 🏆**
