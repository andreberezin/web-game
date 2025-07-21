import {useEffect, useState} from 'react';

export function JoinGame({clientManager, setIsJoinGame, isGameStarted, setIsGameStarted}) {
	const [games, setGames] = useState(clientManager.games);

	function ShowAvailableGames() {
		return(
			Array.from(games.entries()).map(([gameId, gameData]) => (
				<li key={gameId}>
					Game ID: {gameId}
				</li>
			))
		)
	}

	function joinGame(gameId) {
		setIsJoinGame(false);
		setIsGameStarted(true);

		// console.log("gameId: ", gameId);
		// console.log("games: ", games);

		if (games.has(gameId)) {
			const socket = clientManager.socketHandler.socket;
			socket.emit('joinGame', gameId);
			//socket.joinGame(gameId);

			clientManager.gameInterfaceService.createGameUI();
			clientManager.startRenderLoop();
		} else {
			alert('Invalid game ID');
		}
	}

	return (
		<div className={"menu-items"}>
			<form onSubmit={(event) => {
				event.preventDefault();
				joinGame(event.target[0].value)
			}}>
				<label>
					Game ID:
					<br/>
					<input
						type={"text"}
					/>
				</label>
				<button type={"submit"}>
					Join
				</button>
			</form>
			<div className={"games-list"}>
				<p>Available games:</p>
				<ul>
					<ShowAvailableGames/>
				</ul>

			</div>
			<button className={"back"}
				onClick={() => {setIsJoinGame(false)}}>
				Back
			</button>
		</div>
	)
}