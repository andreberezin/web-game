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

export function Menu({clientManager, setError, setView, view}) { // isGameStarted, setIsGameStarted,
	// const [isCreateGame, setIsCreateGame] = useState(false);
	// const [isCreatePlayer, setIsCreatePlayer] = useState(false);
	// const [isInstructions, setIsInstructions] = useState(false);
	const [gameId, setGameId] = useState(null);


	// todo add logic to save game id to browser storage to automatically join correct game when refreshing

	const [games, setGames] = useState({});

	useEffect(() => {
		//const socket = clientManager.socketHandler.socket;

		clientManager.socketHandler.on("updateAvailableGames", (gamesList) => {
			const gamesObj = Object.fromEntries(gamesList.map((game) => [game.id, game]));

			setGames(gamesObj);
		});

		console.log("games: ", games);

		return () => {
			clientManager.socketHandler.on("updateAvailableGames", null);
		}

		// eslint-disable-next-line
	}, [clientManager.socketHandler]);

	return(
			<div id={"menu"}>
				<div id={"title"}>Cube Wars</div>

				{view === 'main' && // !isCreateGame && !isGameStarted && !isCreatePlayer && !isInstructions &&
					<>
						<InstructionsButton
							setView={setView}
						/>

						<JoinGame
							setView={setView}
							setGameId={setGameId}
							gameId={gameId}
							games={games}
							setError={setError}
						/>

						<CreateGameButton setView={setView}/>
					</>
				}

				{view === 'create-game' && // isCreateGame && !isGameStarted && !isCreatePlayer && !isInstructions &&
					<CreateGame
						clientManager={clientManager}
						setView={setView}
					/>
				}

				{view === 'create-player' && // isCreatePlayer && !isCreateGame && !isGameStarted && !isInstructions &&
					<CreatePlayer
						clientManager={clientManager}
						setView={setView}
						gameId={gameId}
						setError={setError}
					/>
				}

				{view === 'instructions' && // isInstructions && !isCreateGame && !isGameStarted && !isCreatePlayer &&
					<Instructions
						setView={setView}
					/>
				}
			</div>
	)
}