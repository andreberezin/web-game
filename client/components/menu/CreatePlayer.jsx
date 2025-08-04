import { IoChevronBackCircleOutline } from "react-icons/io5";
import {useEffect, useState} from 'react';

export function CreatePlayer({clientManager, setIsGameStarted, setIsCreatePlayer, gameId}) {
	const [name, setName] = useState(null);
	const [error, setError] = useState(null);


	useEffect(() => {
		//const socket = clientManager.socketHandler.socket;

		clientManager.socketHandler.onError((message) => {
			setError(message)
		});

		return () => {
			clientManager.socketHandler.onError(null);
		}

	}, [clientManager.socketHandler]); // empty deps now fine because no external dependencies used in handlers


	useEffect(() => {

		if (error) {
			setIsGameStarted(false);
			setIsCreatePlayer(true);
		}

	}, [error, setIsCreatePlayer, setIsGameStarted])

	function joinGame() {
		if (!name) {
			setError("Please enter a name");
			console.log(error);
			return;
		}

		if (!gameId) {
			setError("Game not found")
			console.log(error);
			return;
		}

		if (gameId && name) {
			console.log("Joining game", gameId);
			const socket = clientManager.socketHandler.socket;
			socket.emit('joinGame', gameId, name);
			setIsGameStarted(true);
			setIsCreatePlayer(false);
		}
	}

	return (
		<div id={"create-player"} className={"menu-item"}>

			<div className={"back-button-container"}>
				<button
					className={"back"}
					onClick={() => setIsCreatePlayer(false)}
					type="button"
				>
					<IoChevronBackCircleOutline />
				</button>
			</div>

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

							if (value.length <= 10 && value.length >= 3) {
								setName(value);
							}
						}}
					/>
				</label>

			</form>

			<button
				className={"submit"}
				type={"submit"}
				form={"create-player-form"}
				disabled={!name}
			>
				Join
			</button>

		</div>
	)
}