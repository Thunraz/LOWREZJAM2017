import { PCFShadowMap, WebGLRenderer } from 'three';

import { GameProperties as GP } from './GameProperties';
import { GameStateMain } from './GameStateMain';
import { IGameState } from './IGameState';
import { IInputManager } from './IInputManager';
import { WebGLRendererParameters } from 'three/src/renderers/WebGLRenderer';

export class Game {
    public static runtime: number;

    private gameElement: Element | HTMLElement;
    private debugElement: Element | HTMLElement;

    private inputManager: IInputManager;

    private lastFrameTime = 0;
    private frameCounter = 0;

    private currentGameState: IGameState;

    private readonly renderer: WebGLRenderer;

    /**
     * Initializes a new Game instance
     * @param{Element|HTMLElement} gameElement the element where the game will be rendered in
     * @param{Element|HTMLElement} debugElement the element where debug output will be put
     * @param{IInputManager} inputManager custom instance of {IInputManager}
     * @param{IGameState} startupGameState (optional) the game state to start the game with
     * @param{WebGLRendererParameters} rendererParameters (optional) parameters to pass to the renderer
     */
    public constructor(
        gameElement: Element | HTMLElement,
        debugElement: Element | HTMLElement,
        inputManager: IInputManager,
        startupGameState?: IGameState,
        rendererParameters?: WebGLRendererParameters
    ) {
        Game.runtime = 0.0;

        this.gameElement = gameElement;
        this.debugElement = debugElement;

        this.inputManager = inputManager;
        this.currentGameState = startupGameState ?? new GameStateMain();

        this.renderer = new WebGLRenderer(rendererParameters ?? { antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(GP.GameSize.x, GP.GameSize.y);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFShadowMap;
        this.gameElement.appendChild(this.renderer.domElement);
        this.renderer.domElement.removeAttribute('style');
    }


    /**
     * Starts this game instance's main loop
     * @returns{void}
     */
    public start(): void {
        // eslint-disable-next-line no-console
        console.log('⛵ Welcome to make-sail! 🌊');
        this.gameLoop(0);
    }

    private draw(): void {
        this.currentGameState.render(this.renderer);
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

        if (this.inputManager.enabled) {
            this.inputManager.update();
            this.currentGameState.update(deltaT / 1000, this.inputManager.states);
            this.draw();
        } else if (this.frameCounter % 10 === 0) {
            this.draw();
        }

        this.frameCounter++;
    }
}
