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
      <div
          role={"button"}
          tabIndex={0}
          id={"game-field"}
          onKeyDown={(event) => {
              handleKeyDown(event)
          }}
          onKeyUp={(event) => {
              handleKeyUp(event)
          }}
      >
          <div id={"player"}></div>
      </div>

  )
}

export default App
