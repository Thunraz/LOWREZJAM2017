import * as Stats from 'stats';

import Controls from './classes/Controls.js';
import Game     from './classes/Game';

let controls = new Controls();
let game     = new Game(controls);

let lastFrameTime = 0;

let frameCounter = 0;

let fpsStats = new Stats();
let upsPanel = fpsStats.addPanel(new Stats.Panel('UPS', '#ff8', '#221'));
document.body.appendChild(fpsStats.dom);

/**
 * Main game loop
 * @param {number} currentFrameTime Time in seconds
 * @returns {void}
 */
function gameLoop(currentFrameTime) {
    fpsStats.begin();

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

    fpsStats.end();

    requestAnimationFrame(gameLoop);
}

// eslint-disable-next-line no-console
console.log('⛵ Welcome to make-sail! 🌊');

gameLoop();