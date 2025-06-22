export function clamp(min, val, max) {
	return val > max ? max : val < min ? min : val;
}