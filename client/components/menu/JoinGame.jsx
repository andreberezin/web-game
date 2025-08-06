import {useEffect, useState} from 'react';

export function JoinGame({clientManager, setIsCreatePlayer, setGameId, gameId, games}) {
	// const [gameId, setGameId] = useState(null);
	const [error, setError] = useState(null);

	function ShowAvailableGames() {
		return(
			// Array.from(games.entries()).map(([gameData]) => (
			// 	<li key={gameData.id} className={"list-item"}>
			// 		Game ID: {gameData.id}
			// 	</li>
			<>
				{Object.keys(games).length > 0 ? (
					Object.entries(games).map(([gameId, game]) => (
						<li
							key={gameId}
							className="list-item"
							onClick={() => {
								setGameId(gameId);
								// joinGame();
							}}
						>
							<div className="game">
								<div className="game-id">
									Game ID: {gameId}
								</div>
								<div className="game-info">
									<div className="player-count">
										Players: {game.players}/{game.settings.maxPlayers}
									</div>
									<div className="private">
										{game.settings.private ? 'Private' : 'Public'}
									</div>
								</div>
							</div>
						</li>
					))
				) : (
					<p>No games available at the moment :(</p>
				)}
			</>
		)
	}

	// function joinGame() {
	// 	setIsGameStarted(true);
	//
	// 	if (gameId) {
	// 		const socket = clientManager.socketHandler.socket;
	// 		socket.emit('joinGame', gameId);
	// 	} else {
	// 		setError("Game not found")
	// 	}
	// }

	return (
		<div
			id={"join-game"}
			className={"menu-item"}
		>
			<form
				id="join-game-form"
				onSubmit={(event) => {
				event.preventDefault();
				// joinGame(event.target[0].value)
			}}>
				<label>
					<input
						id="game-name-input"
						placeholder={"Enter a game ID"}
						type={"text"}
						autoComplete={"off"}
						onChange={(e) => {
							setGameId(e.target.value);
						}}
					/>
				</label>
				<button
					type={"button"}
					id={"join-game-button"}
					disabled={!gameId}
					onClick={() => {
						setIsCreatePlayer(true);
					}}
				>
					Join
				</button>
			</form>
			<div id={"games-list-container"}>
				<p id={"games-list-title"}>Available games</p>
				<ul id={"games-list"}>
					<ShowAvailableGames/>
				</ul>

			</div>
		</div>
	)
}