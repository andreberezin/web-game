export function isGameJoinable(game) {
	return (
		!game.settings.private &&
		game.settings.maxPlayers - Object.keys(game.state.players).length > 0 &&
		game.state.status === 'waiting'
	)
}
