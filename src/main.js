import './css/main.css';

import Controls from './js/Controls';
import Game     from './js/Game';

const controls = new Controls();
const game     = new Game(controls);

let lastFrameTime = 0;
let frameCounter = 0;

/**
 * Main game loop
 * @param {number} currentFrameTime Time in seconds
 * @returns {void}
 */
function gameLoop(currentFrameTime) {
    requestAnimationFrame(gameLoop);
    const deltaT = currentFrameTime - lastFrameTime;
    lastFrameTime = currentFrameTime;

    if (controls.enabled) {
        controls.update();
        game.update(deltaT / 1000);
        game.draw();
    } else if (frameCounter % 10 === 0) {
        game.draw();
    }

    frameCounter++;
}

gameLoop(0);
