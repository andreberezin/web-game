import manualDI from '../di/manualDI.js';
import container from '../di/container.js';

export function createClientManager() {
	manualDI();

	const clientManager = container.resolve('clientManager');
	clientManager.setupCleanup();

	return clientManager;
}