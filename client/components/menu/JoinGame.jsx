export function JoinGame({clientManager, setIsJoinGame, isGameStarted, setIsGameStarted}) {

	return (
		<div className={"menu-items"}>
			<form>
				<label>
					Game ID:
					<br/>
					<input
						type={"text"}
					/>
				</label>
				<button onClick={() => {
					setIsJoinGame(false);
					setIsGameStarted(true);
					//clientManager.createClientManager();
				}}
				>
					Join
				</button>
			</form>
			<div className={"games-list"}>
				<p>Available games:</p>
				<ul>
					<li>game 1 players 3/4</li>
					<li>game 1 players 1/4</li>
				</ul>

			</div>
			<button className={"back"}
				onClick={() => {setIsJoinGame(false)}}>
				Back
			</button>
		</div>
	)
}