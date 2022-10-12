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

    private readonly timePerUpdate = 1 / 200;
    private readonly maxNumberOfUpdatesPerFrame = 100;
    private lag = 0.0;

    private currentGameState: IGameState;

    private readonly _renderer: WebGLRenderer;

    /**
     * Initializes a new Game instance
     * @param{Element|HTMLElement} gameElement the element where the game will be rendered in.
     * This should be a container and not a canvas element!
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

        this._renderer = new WebGLRenderer(rendererParameters ?? { antialias: true });
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(resolution.x, resolution.y);
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = PCFShadowMap;
        this.gameElement.appendChild(this._renderer.domElement);
        this._renderer.domElement.removeAttribute('style');
    }

    public get renderer() {
        return this._renderer;
    }

    /**
     * Starts this game instance's main loop
     * @returns{void}
     */
    public start(): void {
        // eslint-disable-next-line no-console
        console.log('⛵ Welcome to make-sail! 🌊');
        this.currentGameState.start(this);
        this.gameLoop(0);
    }

    /**
     * Writes debug output into debugElement. Is cleared every frame.
     * @param{string | number | boolean | object} debugText the text to write. If an object is passed,
     * it will be stringified to JSON
     * @returns{void}
     */
    debug(debugText: string | number | boolean | object): void {
        let text = debugText;
        if (typeof (text) === 'object') {
            text = JSON.stringify(text);
        }
        this.debugElement.innerHTML += `${text}\n`;
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
        const deltaT = (currentFrameTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentFrameTime;

        this.debugElement.innerText = '';

        if (this.inputManager.enabled) {
            this.lag += deltaT;
            let numberOfUpdatesThisFrame = 0;

            do {
                this.inputManager.update();
                this.currentGameState.update(this.timePerUpdate, this.inputManager.states);
                this.lag -= this.timePerUpdate;
                numberOfUpdatesThisFrame++;

                if (numberOfUpdatesThisFrame >= this.maxNumberOfUpdatesPerFrame) {
                    // eslint-disable-next-line no-console
                    console.warn(`number of update operations exceeds maximum of ${this.maxNumberOfUpdatesPerFrame}`);
                    this.lag = 0.0;
                    break;
                }
            } while (this.lag >= this.timePerUpdate);
            this.draw();
        } else if (this.frameCounter % 10 === 0) {
            this.draw();
        }

        this.frameCounter++;
        requestAnimationFrame((cft) => this.gameLoop(cft));
    }
}
