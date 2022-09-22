import { Controls } from './Controls';
import { GameStateMain } from './GameStateMain';
import { IGameState } from './IGameState';

export class Game {
    private gameElement: Element;
    private debugElement: Element;

    private controls: Controls;

    private lastFrameTime = 0;
    private frameCounter = 0;

    private currentGameState : IGameState;

    constructor(gameElement: Element, debugElement: Element) {
        this.gameElement = gameElement;
        this.debugElement = debugElement;

        this.controls = new Controls();
    }

    init(): void {
        // eslint-disable-next-line no-console
        console.log('⛵ Welcome to make-sail! 🌊');
        this.currentGameState = new GameStateMain();
        this.gameLoop(0);
    }

    private gameLoop(currentFrameTime: DOMHighResTimeStamp) {
        requestAnimationFrame((cft) => this.gameLoop(cft));
        const deltaT = currentFrameTime - this.lastFrameTime;
        this.lastFrameTime = currentFrameTime;

        if (this.controls.enabled) {
            this.controls.update();
            this.currentGameState.update(deltaT / 1000);
            this.currentGameState.draw();
        } else if (this.frameCounter % 10 === 0) {
            this.currentGameState.draw();
        }

        this.frameCounter++;
    }
}
