export function renderError(errorMessage) {
	const errorElement = document.getElementById(`error`);

	if (errorMessage) {
		errorElement.textContent = errorMessage.toString();
		errorElement.classList.remove('hidden');
		errorElement.classList.add('show');
	} else {
		setTimeout(() => {
			errorElement.classList.add('hidden');
			errorElement.classList.remove('show');
			errorElement.textContent = '';
		}, 2500)
	}
}