import {BackButton} from './BackButton.jsx';
import '../../styles/menu/instructions.scss'

export function Instructions({setView, playClick}) {

	return (
		<div
			id={'instructions'}
			className={"menu-item"}
		>
			<BackButton setView={setView} lastView={'main'} playClick={playClick} />
			<div id={'instructions-text'}>
				<p>The objective of the game is to kill your enemies and survive.</p>
				<p>The game lasts until the game timer finishes or 1 player is left.</p>
				<p>Each kill and each life left gives you 1 point.</p>
				<p>The player with the most points or the last one alive wins the game.</p>
				<p>Various power-ups spawn during the game which can be picked up.</p>
				<p>Controls:
					<br/>
					- Move: WASD/arrow keys
					<br/>
					- Aim: mouse
					<br/>
					- Shoot: left click
					<br/>
					- Fullscreen: CTRL + F
					<br/>
					- Mute: CTRL + M
				</p>
			</div>
		</div>
	)
}