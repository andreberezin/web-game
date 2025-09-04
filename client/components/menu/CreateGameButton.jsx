import '../../styles/menu/createGameButton.scss'

export function CreateGameButton({setView, playClick}) {
	return (
		<div id={"create-game-button-container"} className={"menu-item"}>
			<button id={"create-game-button"} className={'other-button'} onClick={() => {
				playClick();
				setView('create-game')
			}}
			>
				Create game
			</button>
		</div>
		)
}