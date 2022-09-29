import { PCFShadowMap, Vector2, WebGLRenderer } from 'three';
import { IGameState } from './IGameState';
import { IInputManager } from './IInputManager';
import { WebGLRendererParameters } from 'three/src/renderers/WebGLRenderer';

export class Game {
    public static runtime: number;

    private _gameElement: HTMLElement;
    private _debugElement: HTMLElement;

    private _inputManager: IInputManager;

    private _lastFrameTime = 0;
    private _frameCounter = 0;

    private _currentGameState: IGameState;

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
        Game.runtime = 0.0;

        this._gameElement = <HTMLElement>gameElement;
        this._debugElement = <HTMLElement>debugElement;

        this._inputManager = inputManager;
        this._currentGameState = startupGameState;

        this.renderer = new WebGLRenderer(rendererParameters ?? { antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(resolution.x, resolution.y);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFShadowMap;
        this._gameElement.appendChild(this.renderer.domElement);
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
        this._currentGameState.render(this.renderer);
    }


    /**
     * Runs the actual game loop
     * @param {DOMHighResTimeStamp} currentFrameTime a number that reflects the total runtime
     * @returns {void}
     * @private
     */
    private gameLoop(currentFrameTime: DOMHighResTimeStamp): void {
        requestAnimationFrame((cft) => this.gameLoop(cft));
        const deltaT = currentFrameTime - this._lastFrameTime;
        this._lastFrameTime = currentFrameTime;

        this._debugElement.innerText = '';

        if (this._inputManager.enabled) {
            this._inputManager.update();
            this._currentGameState.update(deltaT / 1000, this._inputManager.states);
            this.draw();
        } else if (this._frameCounter % 10 === 0) {
            this.draw();
        }

        this._frameCounter++;
    }
}
