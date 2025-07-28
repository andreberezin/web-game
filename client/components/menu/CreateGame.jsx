import {useRef} from 'react';

export function CreateGame({clientManager, setIsCreateGame, setIsGameStarted}) {
	const gameSettings = useRef({
		private: false,
		maxPlayers: 4,
		duration: 600000,
	});

	function startGame(gameSettings) {
		setIsGameStarted(true);

		const socket = clientManager.socketHandler.socket;
		socket.emit('createGame', socket.id, gameSettings);

		// clientManager.gameInterfaceService.createGameUI();
		// clientManager.startRenderLoop();
	}

	return (
		<div
			id={"create-game"}
			className={"menu-item"}
		>
			<form id={"create"}
				onSubmit={(e) => {
					e.preventDefault();
					startGame(gameSettings.current);}}>
				<label>
					Private
					<input
						id={"private"}
						name={"private"}
						type="checkbox"
						onChange={() => gameSettings.current.private = !gameSettings.current.private}
					/>
				</label>

				<button
					className={"submit"}
					type={"submit"}>
					Start
				</button>
			</form>

			<button
				id={"back"}
				onClick={() => {setIsCreateGame(false)}}>
				Back
			</button>

		</div>
	)
}