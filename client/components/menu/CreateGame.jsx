import {useRef, useState} from 'react';

export function CreateGame({clientManager, setIsCreateGame, setIsGameStarted}) {
	const gameSettings = useRef({
		private: false,
		maxPlayers: 4,
		map: "empty",
		duration: 600000,
	});
	const [name, setName] = useState(null)

	function startGame() {
		setIsGameStarted(true);

		const socket = clientManager.socketHandler.socket;
		socket.emit('createGame', socket.id, gameSettings.current, name);

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
					startGame();}}>
				<label>
					Player name*
					<input
						id={"name"}
						name={"name"}
						type="text"
						required={true}
						minLength={3}
						maxLength={10}
						placeholder={"3-10 characters"}
						autoComplete={"false"}
						onChange={(e) => {
							const value = e.target.value;

							if (value.length >= 3 && value.length <= 10) {
								setName(value);
							}
						}}
					/>
				</label>
				<label>
					Private
					<input
						id={"private"}
						name={"private"}
						type="checkbox"
						onChange={() => gameSettings.current.private = !gameSettings.current.private}
					/>
				</label>

				<label>
					Map
					<select
						id={"map"}
						name={"map"}
						onChange={(e) => {
							gameSettings.current.gameField = e.target.value;
						}}
					>
						<option value="empty">Empty</option>
						<option value="simple">Simple</option>
					</select>
				</label>

				<button
					className={"submit"}
					type={"submit"}
					disabled={!name}

				>
					Start
				</button>
			</form>

			<button
				id={"back"}
				onClick={() => {setIsCreateGame(false)}}
			>
				Back
			</button>

		</div>
	)
}