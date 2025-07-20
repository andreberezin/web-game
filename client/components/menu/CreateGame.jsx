export function CreateGame({clientManager, setIsCreateGame, isGameStarted, setIsGameStarted}) {

	function startGame() {
		setIsCreateGame(false);
		setIsGameStarted(true);

		const socket = clientManager.socketHandler.socket;
		socket.emit('createGame', socket.id);

		clientManager.gameInterfaceService.createGameUI();
		clientManager.startRenderLoop();
	}

	return (
		<div className={"menu-items"}>

			<button onClick={() => {
				startGame();
			}}
			>
				Start
			</button>
			<button className={"back"}
				onClick={() => {setIsCreateGame(false)}}>
				Back
			</button>

		</div>
	)
}