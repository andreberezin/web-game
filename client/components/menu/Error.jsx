import '../../styles/error.scss'
import {useEffect} from 'react';

export function Error({error, setError}) {

	useEffect(() => {
		const el = document.getElementById("error");

		if (error && el) {

			el.classList.remove("shown");

			requestAnimationFrame(() => {
				el.classList.add("shown");
			});

			const timer = setTimeout(() => {
				el.classList.remove("shown"); // start slide-out
				setTimeout(() => setError(null), 500);
			}, 2500);

			return () => clearTimeout(timer);
		}
	}, [error, setError]);

	return (
		<div
			id={"error"}
			className={`${error ? "shown" : ""}`}
		>
			{error}
		</div>
	);
}