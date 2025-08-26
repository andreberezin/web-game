import '../../styles/menu/createGameButton.scss'

export function CreateGameButton({setView}) {
	return (
		<div id={"create-game-button-container"} className={"menu-item"}>
			<button id={"create-game-button"} className={'other-button'} onClick={() => {
				setView('create-game')
			}}
			>
				Create game
			</button>
		</div>
		)
}