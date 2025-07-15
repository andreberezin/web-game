import './menu.scss'
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
						console.log("Create game!")
					}}
					>
						Create game
					</button>
					<button id={"join-game"} onClick={() => {
						setIsCreateGame(false);
						setIsJoinGame(true);
						console.log("Join game!")
					}
					}
					>
						Join game
					</button>
				</div>
			}

			{isJoinGame && !isGameStarted &&
				<JoinGame
					setIsJoinGame={setIsJoinGame}
					isGameStarted={isGameStarted}
					setIsGameStarted={setIsGameStarted}
					clientManager={clientManager}
				/>
			}

			{isCreateGame && !isGameStarted &&
				<CreateGame
					setIsCreateGame={setIsCreateGame}
					isGameStarted={isGameStarted}
					setIsGameStarted={setIsGameStarted}
					clientManager={clientManager}
				/>
				// CreateGame(setIsCreateGame, isGameStarted, setIsGameStarted)
			}

		</div>
	)
}