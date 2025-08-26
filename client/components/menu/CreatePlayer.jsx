import { IoChevronBackCircleOutline } from "react-icons/io5";
import {useEffect, useState} from 'react';
import {BackButton} from './BackButton.jsx';

export function CreatePlayer({clientManager, setView, gameId, setError}) {
	const [name, setName] = useState(null);

	useEffect(() => {
		const socketHandler = clientManager.socketHandler;

		socketHandler.on("error", (message) => {
			setError(message)
		});

		socketHandler.addExternalListener("joinGameSuccess", () => {
			setView('game')
		});

		return () => {
			socketHandler.on("error", null);
			socketHandler.on("createGameSuccess", null);
			clientManager.socketHandler.addExternalListener("joinGameSuccess", null);
		}

	}, [clientManager.socketHandler, setError, setView]);


	function joinGame() {
		if (!name) {
			setError("Please enter a name");
			return;
		}

		if (!gameId) {
			setError("Game not found")
			return;
		}

		const socket = clientManager.socketHandler.socket;
		socket.emit('joinGame', gameId, name);
	}

	return (
		<div id={"create-player"} className={"menu-item"}>

			<BackButton setView={setView} lastView={'main'}/>

			<form
				id={"create-player-form"}
				onSubmit={(e) => {
					e.preventDefault();
					joinGame(gameId, name)
				}}

			>
				<label>
					Player Name*
					<input
						id="name"
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

			</form>

			<button
				className={"submit other-button"}
				type={"submit"}
				form={"create-player-form"}
				disabled={!name || (name.length <= 3)}
			>
				Play
			</button>

		</div>
	)
}