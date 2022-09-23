import { GameProperties as GP } from './GameProperties';
import { GameStateMain } from './GameStateMain';
import { IGameState } from './IGameState';
import { IInputManager } from './IInputManager';
import { InputManager } from './InputManager';
import { WebGLRenderer } from 'three';

export class Game {
    private gameElement: Element | HTMLElement;
    private debugElement: Element | HTMLElement;

    private controls: IInputManager;

    private lastFrameTime = 0;
    private frameCounter = 0;

    private currentGameState : IGameState;

    private renderer : WebGLRenderer;

    /**
     * Initializes a new Game instance
     * @param{Element|HTMLElement} gameElement the element where the game will be rendered in
     * @param{Element|HTMLElement} debugElement the element where debug output will be put
     * @param{IInputManager} inputManager (optional) custom instance of {IInputManager}
     * @param {IGameState} startupGameState the game state to start the game with
     */
    public constructor(
        gameElement: Element | HTMLElement,
        debugElement: Element | HTMLElement,
        inputManager?: IInputManager,
        startupGameState?: IGameState,
    ) {
        this.gameElement = gameElement;
        this.debugElement = debugElement;

        this.controls = inputManager ?? new InputManager();
        this.currentGameState = startupGameState ?? new GameStateMain();

        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(GP.GameSize.x, GP.GameSize.y);
    }


    /**
     * Initializes and starts this game instance
     * @returns{void}
     */
    public start(): void {
        // eslint-disable-next-line no-console
        console.log('⛵ Welcome to make-sail! 🌊');
        this.gameLoop(0);
    }


    /**
     * Runs the actual game loop
     * @param {DOMHighResTimeStamp} currentFrameTime a number that reflects the total runtime
     * @returns {void}
     * @private
     */
    private gameLoop(currentFrameTime: DOMHighResTimeStamp): void {
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
