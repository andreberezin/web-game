import {useRef, useState} from 'react';
import '../../styles/menu/createGame.scss'
import {BackButton} from './BackButton.jsx';

export function CreateGame({clientManager, setView}) {
	const gameSettings = useRef({
		private: false,
		maxPlayers: 4,
		mapType: "empty",
		duration: 15000,
	});
	const [name, setName] = useState(null)

	function startGame() {
		setView('game')

		const socket = clientManager.socketHandler.socket;
		socket.emit('createGame', socket.id, name, gameSettings.current);
	}

	return (
		<div
			id={"create-game"}
			className={"menu-item"}
		>
			<BackButton setView={setView} lastView={'main'}/>

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

							if (value.length <= 10) {
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
				className={"submit other-button"}
				type={"submit"}
				form={"create-game-form"}
				disabled={!name || (name.length < 3)}
			>
				Play
			</button>

		</div>
	)
}
