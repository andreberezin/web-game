import ngrok from 'ngrok';
import dotenv from 'dotenv';

async function startTunnel() {
	dotenv.config();

	const NGROK_HOSTNAME = process.env.NGROK_HOSTNAME;
	const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;

	try {
		console.log('🔗 Starting ngrok tunnel...');
		console.log('⏳ Waiting for server to be ready...');

		await new Promise(resolve => setTimeout(resolve, 3000));

		const url = await ngrok.connect({
			addr: `http://localhost:${EXPRESS_PORT}`,
			hostname: `${NGROK_HOSTNAME}`,
			region: 'eu'
		});

		console.log('🚀 Tunnel created successfully!');
		console.log(`📡 Backend server public URL: ${url}`);
		console.log('🔥 Your app is now publicly accessible!');
		console.log('Press Ctrl+C to stop the tunnel');

		process.on('SIGINT', async () => {
			console.log('\nClosing tunnel...');
			try {
				await ngrok.kill();
			} catch (err) {
				console.warn('ngrok.kill() failed:', err.message);
			}

			try {
				await ngrok.disconnect();
			} catch (err) {
				console.warn('ngrok.disconnect() failed:', err.message);
			}

			console.log('Tunnel closed');
			process.exit();
		});

	} catch (error) {
		console.error('Error creating tunnel:', error);
		process.exit(1);
	}
}

startTunnel();
