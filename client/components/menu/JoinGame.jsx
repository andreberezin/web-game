import {isGameJoinable} from '../../utils/isGameJoinable.js';
import '../../styles/menu/joinGame.scss'

export function JoinGame({setView, setGameId, gameId, games, setError}) {

	function handleGameNotJoinableError(game) {
		if (!game) {
			setError("Game not found");
		} else if (game.settings.private) {
			setError("Cannot join private game");
		} else if (game.state.status !== 'waiting') {
			setError('Game has already started')
		} else if (game.settings.maxPlayers - Object.keys(game.state.players).length <= 0) {
			setError('Game is full')
		} else {
			setError('Something went wrong')
		}
	}

	function ShowAvailableGames() {
		return(
			<>
				{Object.keys(games).length > 0 ? (
					Object.entries(games)
						.map(([gameId, game]) => (
						<li
							key={gameId}
							className="list-item"
							onClick={() => {
								if (isGameJoinable(game)) {
									setGameId(gameId);
									setView('create-player')
								} else {
									handleGameNotJoinableError(game);
								}
							}}
						>
							<div className={`game ${(isGameJoinable(game)) ? 'joinable' : ''}`}>
								<div className="game-id">
									Game ID: {gameId}
								</div>
								<div className="game-info">
									<div className="player-count">
										Players: {Object.keys(game.state.players).length}/{game.settings.maxPlayers}
									</div>
									<div className="private">
										{game.settings.private ? 'Private' : 'Public'}
									</div>
									<div className="status">
										Status: {game.state.status}
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

	return (
		<div
			id={"join-game"}
			className={"menu-item"}
		>
			<form
				id="join-game-form"
				onSubmit={(event) => {
				event.preventDefault();
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
					className={'other-button'}
					disabled={!gameId}
					onClick={() => {
						const game = games[gameId];
						if (game && isGameJoinable(game)) {
							setView('create-player')
						} else {
							setError('Game not found')
						}
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