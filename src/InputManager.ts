import { IInputManager } from './IInputManager';
import { IInputStates } from './IInputStates';
import { IInputKeyMap } from './IInputKeyMap';

export class InputManager<TInputStates extends IInputStates, TInputKeyMap extends IInputKeyMap>
implements IInputManager<TInputStates> {
    private readonly _noticeElement: HTMLElement;
    private readonly _blockerElement: HTMLElement;
    private readonly _rootElement: Element;

    private readonly _states: TInputStates;
    private readonly _keyMap: TInputKeyMap;

    constructor(inputStates: TInputStates, inputKeyMap: TInputKeyMap) {
        this._states = inputStates;
        this._keyMap = inputKeyMap;

        // Add a couple of event listeners
        document.addEventListener('pointerlockchange', () => {
            this.onPointerLockChange();
        }, false);
        document.addEventListener('pointerlockerror', () => {
            this.onPointerLockError();
        }, false);
        document.addEventListener('mousemove', (e) => {
            this.onMouseMove(e);
        }, false);
        document.addEventListener('click', () => {
            this.onMouseClick();
        }, false);
        document.addEventListener('mouseup', () => {
            this.onMouseUp();
        }, false);
        document.addEventListener('mousedown', () => {
            this.onMouseDown();
        }, false);
        document.addEventListener('keydown', (e) => {
            this.onKeyDown(e);
        }, false);
        document.addEventListener('keyup', (e) => {
            this.onKeyUp(e);
        }, false);

        this._noticeElement = document.getElementById('notice-container');
        this._blockerElement = document.getElementById('blocker');
        this._rootElement = document.body;

        this._noticeElement.addEventListener('click', () => {
            this._noticeElement.style.display = 'none';
            this._rootElement.requestPointerLock();
        }, false);
    }

    get states(): TInputStates {
        return this._states;
    }

    _enabled: boolean;

    public get enabled() {
        return this._enabled;
    }

    /**
     * Update controls
     * @returns {void}
     */
    public update() {
        this.states.leftMouseJustClicked = false;
        this.states.leftMouseJustUp = false;
        this.states.leftMouseJustDown = false;
        this.states.leftMouseUp = true;
        this.states.leftMouseDown = false;

        this.states.movementX = 0.0;
        this.states.movementY = 0.0;
    }

    /**
     * Callback when point lock changes
     * @returns {void}
     */
    private onPointerLockChange() {
        if (document.pointerLockElement === this._rootElement) {
            this._enabled = true;

            this._blockerElement.style.display = 'none';
        } else {
            this._enabled = false;

            this._blockerElement.style.display = 'block';
            this._noticeElement.style.display = '';
        }
    }

    /**
     * Callback when an error during pointer locking occurred
     * @returns {void}
     */
    private onPointerLockError() {
        this._noticeElement.style.display = '';
    }

    /**
     * Handles key down events
     * @param {Event} e Key down event
     * @returns {void}
     */
    private onKeyDown(e) {
        const code = this._keyMap[e.code];

        if (code !== undefined) {
            this.states[code] = true;
        }
    }

    /**
     * Handles key up events
     * @param {Event} e Key up event
     * @returns {void}
     */
    private onKeyUp(e) {
        const code = this._keyMap[e.code];

        if (code !== undefined) {
            this.states[code] = false;
        }
    }

    /**
     * Handles mouse move event
     * @param {Event} e Mouse move event
     * @returns {void}
     */
    private onMouseMove(e) {
        this.states.movementX = e.movementX;
        this.states.movementY = e.movementY;
    }

    /**
     * Handles mouse click event
     * @returns {void}
     */
    private onMouseClick() {
        this.states.leftMouseJustClicked = true;
    }

    /**
     * Handles mouse up event
     * @returns {void}
     */
    private onMouseUp() {
        this.states.leftMouseJustUp = true;
        this.states.leftMouseDown = false;
        this.states.leftMouseUp = true;
    }

    /**
     * Handles mouse down event
     * @returns {void}
     */
    private onMouseDown() {
        this.states.leftMouseJustDown = true;
        this.states.leftMouseDown = true;
        this.states.leftMouseUp = false;
    }
}
