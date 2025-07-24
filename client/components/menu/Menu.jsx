import '../../styles/menu.scss'
import {JoinGame} from './JoinGame.jsx';
import {useState} from 'react';
import {CreateGame} from './CreateGame.jsx';

export function Menu({clientManager, isGameStarted, setIsGameStarted}) {
	const [isCreateGame, setIsCreateGame] = useState(false);

	// todo add logic to save game id to browser storage to automatically join correct game when refreshing


	return(
		<div id={"menu"}>

			{!isCreateGame && !isGameStarted &&
				<>

					<JoinGame clientManager={clientManager} setIsGameStarted={setIsGameStarted}/>

					<button id={"create-game"} onClick={() => {
						setIsCreateGame(true);
					}}
					>
						Create game
					</button>
				</>
			}

			{isCreateGame && !isGameStarted &&
				<CreateGame
					clientManager={clientManager}
					setIsCreateGame={setIsCreateGame}
					setIsGameStarted={setIsGameStarted}
				/>
			}

		</div>
	)
}