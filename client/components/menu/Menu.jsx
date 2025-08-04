import '../../styles/menu.scss'
import {JoinGame} from './JoinGame.jsx';
import {useState} from 'react';
import {CreateGame} from './CreateGame.jsx';
import {CreatePlayer} from './CreatePlayer.jsx';

export function Menu({clientManager, isGameStarted, setIsGameStarted}) {
	const [isCreateGame, setIsCreateGame] = useState(false);
	const [isCreatePlayer, setIsCreatePlayer] = useState(false);
	const [gameId, setGameId] = useState(null);

	// todo add logic to save game id to browser storage to automatically join correct game when refreshing


	return(
		<div id={"menu"}>

			{!isCreateGame && !isGameStarted && !isCreatePlayer &&
				<>
					<JoinGame
						clientManager={clientManager}
						setIsCreatePlayer={setIsCreatePlayer}
						setGameId={setGameId}
						gameId={gameId}
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