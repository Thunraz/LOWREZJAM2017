import Controls from './classes/Controls.js';
import Game     from './classes/Game';

let controls = new Controls();
let game     = new Game(controls);

let lastFrameTime = 0;

let frameCounter = 0;

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
        game.draw();
    } else if(frameCounter % 10 == 0) {
        game.draw();
    }

    frameCounter++;
}

// eslint-disable-next-line no-console
console.log('⛵ Welcome to make-sail! 🌊');

let worker = new Worker('./worker.js');
worker.postMessage = worker.webkitPostMessage || worker.postMessage;
worker.postMessage({
    oimoUrl: './oimo.min.js'
});

gameLoop();