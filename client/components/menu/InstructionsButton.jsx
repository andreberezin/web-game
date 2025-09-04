export function InstructionsButton({setView, playClick}) {
	return (
		<div id={'instructions-button-container'}>
			<button id={'instructions-button'}
					onClick={() => {
						playClick();
						setView('instructions');
					}}

			>
				<i className="fa-solid fa-question"></i>
			</button>
		</div>
	)
}