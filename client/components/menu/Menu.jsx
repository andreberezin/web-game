import '../../styles/menu.scss'
import {JoinGame} from './JoinGame.jsx';
import {useEffect, useState} from 'react';
import {CreateGame} from './CreateGame.jsx';
import {CreatePlayer} from './CreatePlayer.jsx';

export function Menu({clientManager, isGameStarted, setIsGameStarted}) {
	const [isCreateGame, setIsCreateGame] = useState(false);
	const [isCreatePlayer, setIsCreatePlayer] = useState(false);
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

	}, [clientManager.socketHandler, games]); // empty deps now fine because no external dependencies used in handlers


	return(
		<div id={"menu"}>

			{!isCreateGame && !isGameStarted && !isCreatePlayer &&
				<>
					<JoinGame
						clientManager={clientManager}
						setIsCreatePlayer={setIsCreatePlayer}
						setGameId={setGameId}
						gameId={gameId}
						games={games}
					/>

					<div className={"menu-item"} id={"create-game-button-container"}>
						<button id={"create-game-button"} onClick={() => {
							setIsCreateGame(true);
						}}
						>
							Create game
						</button>
					</div>
				</>
			}

			{isCreateGame && !isGameStarted && !isCreatePlayer &&
				<CreateGame
					clientManager={clientManager}
					setIsCreateGame={setIsCreateGame}
					setIsGameStarted={setIsGameStarted}
				/>
			}

			{!isCreateGame && !isGameStarted && isCreatePlayer &&
				<CreatePlayer
					clientManager={clientManager}
					setIsGameStarted={setIsGameStarted}
					setIsCreatePlayer={setIsCreatePlayer}
					gameId={gameId}
				/>
			}

		</div>
	)
}