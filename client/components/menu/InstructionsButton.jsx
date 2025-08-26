export function InstructionsButton({setView}) {
	return (
		<div id={'instructions-button-container'}>
			<button id={'instructions-button'} onClick={() => {
				setView('instructions')
			}}
			>
				<i className="fa-solid fa-question"></i>
			</button>
		</div>
	)
}