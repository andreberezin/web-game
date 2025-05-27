import {useEffect, useRef} from 'react'
import './App.css'
import { io } from 'socket.io-client';

function App() {
    let start;
    const arrowUp = useRef(false);
    const arrowDown = useRef(false);
    const arrowRight = useRef(false);
    const arrowLeft = useRef(false);
    const keyPressStart = useRef(0);

    useEffect(() => {
        console.log('Connecting to socket...');

        const socket = io()

        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
        });

        function renderLoop(timestamp) {

            // update game

            const player = document.getElementById("player");
            const position = player.getBoundingClientRect();
            //position.y = position.y + 40;
            //player.style.top = `${position.y}px`;
            /*
            1. start = alguspunkt, nt 2000 ms
            2. elapsed = uus timestamp - vana timestamp, nt uus timestamp 2100ms, vana timestamp 2000ms 2100- 2000 = 100ms ehk 0.1 sec
            3. shift = 0.00000001
            4. player.style.top = liigu 0.00000001x px
            5. uus timestamp = 2200 ms,
             */
            if (arrowUp.current === true) {
                if (start === undefined) {
                    start = timestamp;
                }
                const elapsed = timestamp - start;
                const shift = Math.min(0.001 * elapsed, 10);
                player.style.top = `${position.y - shift}px`;
            }
            if (arrowLeft.current === true) {
                if (start === undefined) {
                    start = timestamp;
                }
                const elapsed = timestamp - start;
                const shift = Math.min(0.001 * elapsed, 10);
                player.style.left = `${position.x - shift}px`;
            }
            if (arrowRight.current === true) {
                if (start === undefined) {
                    start = timestamp;
                }
                const elapsed = timestamp - start;
                const shift = Math.min(0.001 * elapsed, 10);
                player.style.left = `${position.x + shift}px`;
            }
            if (arrowDown.current === true) {
                if (start === undefined) {
                    start = timestamp;
                }
                const elapsed = timestamp - start;
                const shift = Math.min(0.001 * elapsed, 10);
                player.style.top = `${position.y + shift}px`;
            }

            // player.style.top = `${shift}px`;

            requestAnimationFrame(renderLoop)
        }

        requestAnimationFrame(renderLoop);

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleKeyDown = ((event) => {
        keyPressStart.current = Date.now();

        switch(event.key) {
            case "ArrowUp": {
                arrowUp.current = true;
                break;
            }
            case "ArrowDown": {
                arrowDown.current = true;
                break;
            }
            case "ArrowLeft": {
                arrowLeft.current = true;
                break;
            }
            case "ArrowRight": {
                arrowRight.current = true;
                break;
            }
        }
    })

    const handleKeyUp = ((event) => {
        switch(event.key) {
            case "ArrowUp": {
                arrowUp.current = false;
                break;
            }
            case "ArrowDown": {
                arrowDown.current = false;
                break;
            }
            case "ArrowLeft": {
                arrowLeft.current = false;
                break;
            }
            case "ArrowRight": {
                arrowRight.current = false;
                break;
            }
        }
    })

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
