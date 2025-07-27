import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const serverTarget = process.env.USE_NGROK === 'true' ? 'https://intimate-upright-sunfish.ngrok-free.app' : 'http://192.168.3.61:3000' // https://just-panda-musical.ngrok-free.app

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: serverTarget,
        changeOrigin: true,            // Ensures the Host header matches the target
        secure: false,
      },
      '/socket.io': {
        // target: 'http://localhost:3000',
        target: serverTarget,
        headers : {
          'ngrok-skip-browser-warning':true
        },
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
