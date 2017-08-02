import Controls from './classes/Controls.js';
import Game     from './classes/Game';

let game     = new Game();
let controls = new Controls();

let lastFrameTime = 0;

/**
 * Main game loop
 * @param {number} currentFrameTime Time in seconds
 * @returns {void}
 */
function gameLoop(currentFrameTime) {
    requestAnimationFrame(gameLoop);
    let deltaT = currentFrameTime - lastFrameTime;
    lastFrameTime = currentFrameTime;

    if(controls.enabled) {
        controls.update();
        game.update(deltaT / 1000);
    }

    game.draw();
}

gameLoop();