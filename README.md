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
├── client/                 # React frontend
│   ├── components/         # React components
│   │   └── menu/          # Menu components (lobby, instructions, etc.)
│   ├── core/              # Core client logic
│   ├── models/            # Client-side game models
│   ├── services/          # Client game services
│   ├── sockets/           # Socket.IO client handler
│   ├── styles/            # SCSS stylesheets
│   └── package.json       # Client dependencies
├── server/                # Node.js backend
│   ├── di/                # Dependency injection container
│   ├── models/            # Server-side game models
│   ├── services/          # Server game logic services
│   ├── sockets/           # Socket.IO server handler
│   ├── test/              # Unit tests
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

**Debug mode** (with Node.js inspector):
```bash
npm run dev:debug
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
Create a `.env` file in the server directory:

```env
EXPRESS_PORT=3000
VITE_PORT=5173
```

### Game Settings
Game settings can be configured when creating a game:
- **Max Players**: 2-4 players
- **Game Duration**: 1-2 minutes (configurable)
- **Map Type**: Currently supports "empty" and "simple" maps
- **Private/Public**: Toggle game visibility

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run server tests specifically
cd server && npm test
```

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

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
- Kill processes using ports 3000 or 5173
- Or modify port numbers in environment variables

**Socket connection failed:**
- Ensure server is running before client
- Check firewall settings
- Verify CORS configuration

**Game not loading:**
- Check browser console for errors
- Ensure JavaScript is enabled
- Clear browser cache

**Performance issues:**
- Close other browser tabs
- Check CPU usage
- Ensure adequate RAM available

### Browser Compatibility
- Modern browsers supporting ES6+ modules
- WebSocket support required
- No Canvas API dependencies

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
- Spectator mode
- Mobile device support
- Enhanced visual effects

---

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows existing style guidelines
- Tests pass before submitting
- New features include appropriate tests
- Documentation is updated as needed

---

**Ready to battle? Start your engines and may the best cube win! 🏆**