import {useRef, useState} from 'react';
import '../../styles/menu/createGame.scss'
import {BackButton} from './BackButton.jsx';

export function CreateGame({clientManager, setView, playClick}) {
	const gameSettings = useRef({
		private: false,
		maxPlayers: 4,
		mapType: "empty",
		duration: 60000,
	});
	const [name, setName] = useState(null)

	function startGame() {
		setView('game')

		const socket = clientManager.socketHandler.socket;
		socket.emit('createGame', socket.id, name, gameSettings.current);
	}

	// todo add map choice in next version
	return (
		<div
			id={"create-game"}
			className={"menu-item"}
		>
			<BackButton setView={setView} lastView={'main'} playClick={playClick}/>

			<form id={"create-game-form"}
				onSubmit={(e) => {
					playClick();
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

				{/*<label>*/}
				{/*	Map*/}
				{/*	<select*/}
				{/*		id={"map"}*/}
				{/*		name={"map"}*/}
				{/*		onChange={(e) => {*/}
				{/*			gameSettings.current.mapType = e.target.value;*/}
				{/*		}}*/}
				{/*	>*/}
				{/*		<option value="empty">Empty</option>*/}
				{/*		<option value="simple">Simple</option>*/}
				{/*	</select>*/}
				{/*</label>*/}

				<label>
					Duration
					<select
						id={"duration"}
						name={"duration"}
						onChange={(e) => {
							gameSettings.current.duration = e.target.value;
						}}
					>
						<option value="60000">1 minute</option>
						<option value="120000">2 minutes</option>
						<option value="1000">1 second</option>
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
