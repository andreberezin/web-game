import {createClientManager} from '../../core/App.jsx';

export function CreateGame({setIsCreateGame, isGameStarted, setIsGameStarted, clientManager}) {

	function startGame() {
		setIsCreateGame(false);
		setIsGameStarted(true);
		clientManager.socketHandler.connectToServer();
		clientManager.startRenderLoop();

		// document.getElementById("menu").remove();
		//
		// // const gameField = document.createElement("div")
		// // gameField.addEventListener(onclick(() => {
		// // 	if (document.getElementById(clientManager.myID)) {
		// // 		(document.getElementById(clientManager.myID).focus())
		// // 	}
		// // }))
		//
		// return (
		// 	<div id={"game-field"} onClick={() => {
		// 		if (document.getElementById(clientManager.myID)) {
		// 			(document.getElementById(clientManager.myID).focus())
		// 		}
		// 	}}
		// 	>
		// 	</div>
		// )
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