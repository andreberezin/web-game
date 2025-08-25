import { IoChevronBackCircleOutline } from "react-icons/io5";
import {useEffect, useState} from 'react';

export function CreatePlayer({clientManager, setIsGameStarted, setIsCreatePlayer, gameId, setError}) {
	const [name, setName] = useState(null);

	useEffect(() => {
		const socketHandler = clientManager.socketHandler;

		socketHandler.on("error", (message) => {
			setError(message)
		});

		socketHandler.addExternalListener("joinGameSuccess", () => {
			setIsGameStarted(true);
			setIsCreatePlayer(false);
		});

		return () => {
			socketHandler.on("error", null);
			socketHandler.on("createGameSuccess", null);
			clientManager.socketHandler.addExternalListener("joinGameSuccess", null);
		}

	}, [clientManager.socketHandler, setError, setIsCreatePlayer, setIsGameStarted]);


	// useEffect(() => {
	//
	// 	if (error) {
	// 		setIsGameStarted(false);
	// 		setIsCreatePlayer(true);
	// 	}
	//
	// }, [setIsCreatePlayer, setIsGameStarted])

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

							if (value.length <= 10) {
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
				disabled={!name || (name.length <= 3)}
			>
				Join
			</button>

		</div>
	)
}