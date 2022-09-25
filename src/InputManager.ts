import { IInputManager } from './IInputManager';
import { IInputStates } from './IInputStates';

export class InputManager<T1 extends IInputStates> implements IInputManager<T1> {
    private noticeElement: HTMLElement;

    // public readonly states = {
    //     // Mouse
    //     leftMouseJustClicked: false,
    //     leftMouseJustUp: false,
    //     leftMouseJustDown: false,
    //     leftMouseUp: true,
    //     leftMouseDown: false,
    //
    //     // Keyboard
    //     up: false,
    //     down: false,
    //     left: false,
    //     right: false,
    //     movementX: 0.0,
    //     movementY: 0.0,
    //
    //     toggleRecord: false,
    // };
    private blockerElement: HTMLElement;
    private readonly rootElement: Element;
    private readonly _states: T1;
    private keyMap = {
        38: 'up',    // ↑
        40: 'down',  // ↓
        37: 'left',  // ←
        39: 'right', // →

        87: 'up',    // W
        83: 'down',  // S
        65: 'left',  // A
        68: 'right', // D

        82: 'toggleRecord', // R
    };

    constructor(states: T1) {
        this._states = states;

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

        this.noticeElement = document.getElementById('notice-container');
        this.blockerElement = document.getElementById('blocker');
        this.rootElement = document.body;

        this.noticeElement.addEventListener('click', () => {
            this.noticeElement.style.display = 'none';
            this.rootElement.requestPointerLock();
        }, false);
    }

    get states(): T1 {
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
        if (document.pointerLockElement === this.rootElement) {
            this._enabled = true;

            this.blockerElement.style.display = 'none';
        } else {
            this._enabled = false;

            this.blockerElement.style.display = 'block';
            this.noticeElement.style.display = '';
        }
    }

    /**
     * Callback when an error during pointer locking occurred
     * @returns {void}
     */
    private onPointerLockError() {
        this.noticeElement.style.display = '';
    }

    /**
     * Handles key down events
     * @param {Event} e Key down event
     * @returns {void}
     */
    private onKeyDown(e) {
        const code = this.keyMap[e.which];

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
        const code = this.keyMap[e.which];

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
