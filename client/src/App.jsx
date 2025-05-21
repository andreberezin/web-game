import {useEffect} from 'react'
import './App.css'
import { io } from 'socket.io-client';

function App() {
    useEffect(() => {
        console.log('Connecting to socket...');

        const socket = io()

        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
        });

        function renderLoop() {
            /*if () {
                // do something
            }*/

            requestAnimationFrame(renderLoop);
        }

        requestAnimationFrame(renderLoop);

        return () => {
            socket.disconnect();
        };
    }, []);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
