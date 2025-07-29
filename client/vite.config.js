// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
//
// const NGROK_LINK = process.env.VITE_NGROK_LINK
// const HOSTNAME = process.env.HOSTNAME || 'localhost'
// const PORT = process.env.PORT || 3000
// const local = `http://${HOSTNAME}:${PORT}`
// const serverTarget = process.env.USE_NGROK === 'true' ? NGROK_LINK : local // https://just-panda-musical.ngrok-free.app
//
// console.log(`🔧 Proxy target: ${serverTarget}`);
//
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: serverTarget,
//         changeOrigin: true,            // Ensures the Host header matches the target
//         secure: false,
//       },
//       '/socket.io': {
//         target: serverTarget,
//         headers : {
//           'ngrok-skip-browser-warning':true
//         },
//         ws: true,
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// })

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const NGROK_LINK = env.VITE_NGROK_LINK;
  const HOSTNAME = env.VITE_HOSTNAME || 'localhost';
  const EXPRESS_PORT = env.VITE_EXPRESS_PORT || 3000;
  const VITE_PORT = env.VITE_PORT || 5173;
  const USE_NGROK = env.USE_NGROK === 'true';

  // const local = `http://${HOSTNAME}:${EXPRESS_PORT}`;
  const local = `http://0.0.0.0:${EXPRESS_PORT}`;
  const serverTarget = USE_NGROK ? NGROK_LINK : local;

  return {
    server: {
      port: VITE_PORT,
      proxy: {
        '/api': {
          target: serverTarget,
          changeOrigin: true,
          secure: false,
        },
        '/socket.io': {
          target: serverTarget,
          headers: { 'ngrok-skip-browser-warning': true },
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
  };
});
