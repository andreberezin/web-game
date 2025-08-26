import {BackButton} from './BackButton.jsx';
import '../../styles/menu/instructions.scss'

export function Instructions({setView}) {

	return (
		<div
			id={'instructions'}
			className={"menu-item"}
		>
			<BackButton setView={setView} lastView={'main'}/>
			<div id={'instructions-text'}>
				<p>The object of the game is to kill your enemies</p>
				<p>WASD or arrow keys to move</p>
				<p>Mouse to aim</p>
				<p>Left click to shoot</p>
				<p>The game lasts until the game timer finishes or 1 player is left</p>
				<p>Each kill gives you 1 point</p>
				<p>The player with the most points or the last one alive wins the game</p>
				<p>Various power-ups spawn during the game which can be picked up</p>
			</div>
		</div>
	)
}