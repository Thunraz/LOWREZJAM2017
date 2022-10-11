import { PCFShadowMap, Vector2, WebGLRenderer } from 'three';
import { IGameState } from './IGameState';
import { IInputManager } from './IInputManager';
import { WebGLRendererParameters } from 'three/src/renderers/WebGLRenderer';

export class Game {
    private gameElement: HTMLElement;
    private debugElement: HTMLElement;

    private inputManager: IInputManager;

    private lastFrameTime: DOMHighResTimeStamp = 0;
    private frameCounter = 0;
    private readonly timeStep = 1 / 60;

    private currentGameState: IGameState;

    private readonly renderer: WebGLRenderer;

    /**
     * Initializes a new Game instance
     * @param{Element|HTMLElement} gameElement the element where the game will be rendered in
     * @param{Element|HTMLElement} debugElement the element where debug output will be put
     * @param{Vector2} resolution the game's render resolution
     * @param{IInputManager} inputManager custom instance of {IInputManager}
     * @param{IGameState} startupGameState the game state to start the game with
     * @param{WebGLRendererParameters} rendererParameters (optional) parameters to pass to the renderer
     */
    public constructor(
        gameElement: Element | HTMLElement,
        debugElement: Element | HTMLElement,
        resolution: Vector2,
        inputManager: IInputManager,
        startupGameState: IGameState,
        rendererParameters?: WebGLRendererParameters,
    ) {
        this.gameElement = <HTMLElement>gameElement;
        this.debugElement = <HTMLElement>debugElement;

        this.inputManager = inputManager;
        this.currentGameState = startupGameState;

        this.renderer = new WebGLRenderer(rendererParameters ?? { antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(resolution.x, resolution.y);
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
        let deltaT = (currentFrameTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentFrameTime;

        this.debugElement.innerText = '';

        if (this.inputManager.enabled) {
            do {
                this.inputManager.update();
                this.currentGameState.update(this.timeStep, this.inputManager.states);
                deltaT -= this.timeStep;
            } while (deltaT > this.timeStep);
            this.draw();
        } else if (this.frameCounter % 10 === 0) {
            this.draw();
        }

        this.frameCounter++;
        requestAnimationFrame((cft) => this.gameLoop(cft));
    }
}
