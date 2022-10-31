import { IInputManager } from './lib/IInputManager';
import { IInputStates } from './lib/IInputStates';
import { IInputKeyMap } from './lib/IInputKeyMap';

export class InputManager implements IInputManager {
    private readonly _noticeElement: HTMLElement;
    private readonly _blockerElement: HTMLElement;
    private readonly _rootElement: Element;

    private readonly _states: IInputStates;
    private readonly _keyMap: IInputKeyMap;

    constructor(inputStates: IInputStates, inputKeyMap: IInputKeyMap) {
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

    get states(): IInputStates {
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
        this._states.leftMouseJustClicked = false;
        this._states.leftMouseJustUp = false;
        this._states.leftMouseJustDown = false;
        this._states.leftMouseUp = true;
        this._states.leftMouseDown = false;

        this._states.movementX = 0.0;
        this._states.movementY = 0.0;
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
        const code = this._keyMap.getActionForKey(e.code);

        if (code !== undefined) {
            this._states[code] = true;
        }
    }

    /**
     * Handles key up events
     * @param {Event} e Key up event
     * @returns {void}
     */
    private onKeyUp(e) {
        const code = this._keyMap.getActionForKey(e.code);

        if (code !== undefined) {
            this._states[code] = false;
        }
    }

    /**
     * Handles mouse move event
     * @param {Event} e Mouse move event
     * @returns {void}
     */
    private onMouseMove(e) {
        this._states.movementX = e.movementX;
        this._states.movementY = e.movementY;
    }

    /**
     * Handles mouse click event
     * @returns {void}
     */
    private onMouseClick() {
        this._states.leftMouseJustClicked = true;
    }

    /**
     * Handles mouse up event
     * @returns {void}
     */
    private onMouseUp() {
        this._states.leftMouseJustUp = true;
        this._states.leftMouseDown = false;
        this._states.leftMouseUp = true;
    }

    /**
     * Handles mouse down event
     * @returns {void}
     */
    private onMouseDown() {
        this._states.leftMouseJustDown = true;
        this._states.leftMouseDown = true;
        this._states.leftMouseUp = false;
    }
}
