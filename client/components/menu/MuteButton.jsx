export function MuteButton({playClick, getMute, setMute}) {
	const isMuted = getMute();

	return (
		<div id={'mute-button-container'} className={'hover-button'}>
			<button id={'mute-button'}
					onClick={() => {
						playClick();
						setMute(!isMuted);
					}}
			>
				<i className={`fas ${isMuted ? "fa-volume-xmark" : "fa-volume-high"}`}></i>
			</button>
		</div>
	)
}