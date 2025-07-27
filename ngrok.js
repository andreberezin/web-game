import ngrok from 'ngrok';
import dotenv from 'dotenv';

async function startTunnel() {
    dotenv.config();

    const NGROK_HOSTNAME = process.env.NGROK_HOSTNAME;
    const HOSTNAME = process.env.HOSTNAME || 'localhost';
    const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;

    try {
        console.log('🔗 Starting ngrok tunnel...');
        console.log('⏳ Waiting for server to be ready...');

        // Wait a bit for the server to start
        await new Promise(resolve => setTimeout(resolve, 3000));

        const url = await ngrok.connect({
            addr: `${HOSTNAME}:${EXPRESS_PORT}`,
            // hostname: 'just-panda-musical.ngrok-free.app',
            hostname: `${NGROK_HOSTNAME}`,
            region: 'eu',
        });

        console.log('🚀 Tunnel created successfully!');
        console.log(`📡 Backend server public URL: ${url}`);
        console.log('🔥 Your app is now publicly accessible!');
        console.log('Press Ctrl+C to stop the tunnel');

        // Keep the process running
        process.on('SIGINT', async () => {
            console.log('\n🛑 Closing tunnel...');
            await ngrok.disconnect();
            await ngrok.kill();
            console.log('✅ Tunnel closed');
            process.exit();
        });

    } catch (error) {
        console.error('❌ Error creating tunnel:', error);
        process.exit(1);
    }
}

startTunnel();
