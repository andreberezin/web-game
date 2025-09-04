import {IoChevronBackCircleOutline} from 'react-icons/io5';

export function BackButton({setView, lastView, playClick}) {
	return (
		<div className={"back-button-container"}>
			<button
				className={"back"}
				onClick={() => {
					playClick();
					setView(lastView);
				}}
				type="button"
			>
				<IoChevronBackCircleOutline />
			</button>
		</div>
	)
}