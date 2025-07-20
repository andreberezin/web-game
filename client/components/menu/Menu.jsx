import '../../styles/menu.scss'
import {JoinGame} from './JoinGame.jsx';
import {useState} from 'react';
import {CreateGame} from './CreateGame.jsx';

export function Menu({clientManager, isGameStarted, setIsGameStarted}) {
	const [isJoinGame, setIsJoinGame] = useState(false);const [isCreateGame, setIsCreateGame] = useState(false);

	// todo add logic to save game id to browser storage to automatically join correct game when refreshing


	return(
		<div id={"menu"}>

			{!isJoinGame && !isCreateGame && !isGameStarted &&
				<div className={"menu-items"}>
					<button id={"create-game"} onClick={() => {
						setIsJoinGame(false);
						setIsCreateGame(true);
					}}
					>
						Create game
					</button>
					<button id={"join-game"} onClick={() => {
						setIsCreateGame(false);
						setIsJoinGame(true);
					}
					}
					>
						Join game
					</button>
				</div>
			}

			{isJoinGame && !isGameStarted &&
				<JoinGame
					clientManager={clientManager}
					setIsJoinGame={setIsJoinGame}
					isGameStarted={isGameStarted}
					setIsGameStarted={setIsGameStarted}
				/>
			}

			{isCreateGame && !isGameStarted &&
				<CreateGame
					clientManager={clientManager}
					setIsCreateGame={setIsCreateGame}
					isGameStarted={isGameStarted}
					setIsGameStarted={setIsGameStarted}
				/>
				// CreateGame(setIsCreateGame, isGameStarted, setIsGameStarted)
			}

		</div>
	)
}