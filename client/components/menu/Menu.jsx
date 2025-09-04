import '../../styles/menu/menu.scss'
import '../../styles/menu/backButton.scss'
import '../../styles/menu/instructionsButtons.scss'
import {JoinGame} from './JoinGame.jsx';
import {useEffect, useState} from 'react';
import {CreateGame} from './CreateGame.jsx';
import {CreatePlayer} from './CreatePlayer.jsx';
import {Instructions} from './Instructions.jsx';
import {InstructionsButton} from './InstructionsButton.jsx';
import {CreateGameButton} from './CreateGameButton.jsx';

// todo add logic to save game id to browser storage to automatically join correct game when refreshing
export function Menu({clientManager, setError, setView, view, playClick}) {
	const [gameId, setGameId] = useState(null);
	const [games, setGames] = useState({});

	useEffect(() => {

		clientManager.socketHandler.on("updateAvailableGames", (gamesList) => {
			const gamesObj = Object.fromEntries(gamesList.map((game) => [game.id, game]));

			setGames(gamesObj);
		});

		return () => {
			clientManager.socketHandler.on("updateAvailableGames", null);
		}

		// eslint-disable-next-line
	}, [clientManager.socketHandler]);

	return(
			<div id={"menu"}>
				<div id={"title"}>Cube Wars</div>

				{view === 'main' &&
					<>
						<InstructionsButton
							setView={setView}
							playClick={playClick}
						/>

						<JoinGame
							setView={setView}
							setGameId={setGameId}
							gameId={gameId}
							games={games}
							setError={setError}
							playClick={playClick}
						/>

						<CreateGameButton
							setView={setView}
							playClick={playClick}
						/>
					</>
				}

				{view === 'create-game' &&
					<CreateGame
						clientManager={clientManager}
						setView={setView}
						playClick={playClick}
					/>
				}

				{view === 'create-player' &&
					<CreatePlayer
						clientManager={clientManager}
						setView={setView}
						gameId={gameId}
						setError={setError}
						playClick={playClick}
					/>
				}

				{view === 'instructions' &&
					<Instructions
						setView={setView}
						playClick={playClick}
					/>
				}
			</div>
	)
}