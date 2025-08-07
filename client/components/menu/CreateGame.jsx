import {useRef, useState} from 'react';
import {IoChevronBackCircleOutline} from 'react-icons/io5';

export function CreateGame({clientManager, setIsCreateGame, setIsGameStarted}) {
	const gameSettings = useRef({
		private: false,
		maxPlayers: 4,
		mapType: "empty",
		duration: 60000,
	});
	const [name, setName] = useState(null)

	function startGame() {
		setIsGameStarted(true);

		const socket = clientManager.socketHandler.socket;
		socket.emit('createGame', socket.id, name, gameSettings.current);

		// clientManager.gameInterfaceService.createGameUI();
		// clientManager.startRenderLoop();
	}

	return (
		<div
			id={"create-game"}
			className={"menu-item"}
		>

			<div className={"back-button-container"}>
				<button
					className={"back"}
					onClick={() => setIsCreateGame(false)}
					type="button"
				>
					<IoChevronBackCircleOutline />
				</button>
			</div>

			<form id={"create-game-form"}
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
						autoComplete={"off"}
						onChange={(e) => {
							const value = e.target.value;

							if (value.length >= 3 && value.length <= 10) {
								setName(value);
							}
						}}
					/>
				</label>

				<label>
					Map
					<select
						id={"map"}
						name={"map"}
						onChange={(e) => {
							gameSettings.current.mapType = e.target.value;
						}}
					>
						<option value="empty">Empty</option>
						<option value="simple">Simple</option>
					</select>
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
			</form>

			<button
				className={"submit"}
				type={"submit"}
				form={"create-game-form"}
				disabled={!name}

			>
				Start
			</button>

		</div>
	)
}