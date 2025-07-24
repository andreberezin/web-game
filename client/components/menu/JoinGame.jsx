import {useEffect, useState} from 'react';

export function JoinGame({clientManager, setIsGameStarted}) {
	const [games, setGames] = useState({});

	// todo get only public games
	// todo private games should not be automatically fetched

	useEffect(() => {
		//const socket = clientManager.socketHandler.socket;

		clientManager.socketHandler.onUpdateAvailableGames((gamesList) => {
			const gamesObj = Object.fromEntries(gamesList.map((game) => [game.id, game]));

			setGames(gamesObj);
		});

		return () => {
			clientManager.socketHandler.onUpdateAvailableGames(null);
		}

	}, [clientManager.socketHandler]); // empty deps now fine because no external dependencies used in handlers

	// todo don't display private games
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
							onClick={() => { joinGame(gameId); }}
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

	function joinGame(gameId) {
		setIsGameStarted(true);

		if (gameId) {
			const socket = clientManager.socketHandler.socket;
			socket.emit('joinGame', gameId);
		} else {
			alert('Invalid game ID');
		}
	}

	return (
		<div
			id={"join-game"}
			className={"menu-item"}
		>
			<form onSubmit={(event) => {
				event.preventDefault();
				joinGame(event.target[0].value)
			}}>
				<label>
					<input
						id="game-name-input"
						placeholder={"Enter a game ID"}
						type={"text"}
					/>
				</label>
				<button type={"submit"}>
					Join
				</button>
			</form>
			<div id={"games-list-container"}>
				<p id={"games-list-title"}>Available games:</p>
				<ul id={"games-list"}>
					<ShowAvailableGames/>
				</ul>

			</div>
		</div>
	)
}