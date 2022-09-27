import './css/main.css';
import { Game } from './Game';
import { InputManager } from './InputManager';
import { IInputStates } from './IInputStates';
import { IInputKeyMap, TCodeActionMap } from './IInputKeyMap';

export class MyInputStates extends IInputStates {
    // Keyboard
    public up = false;
    public down = false;
    public left = false;
    public right = false;

    // Misc
    public toggleRecord = false;
}

class MyInputKeyMap extends IInputKeyMap {
    constructor() {
        super();
        this.assignActions(new Array<TCodeActionMap>(
            { code: 'KeyW', action: 'up' },
            { code: 'KeyA', action: 'left' },
            { code: 'KeyS', action: 'down' },
            { code: 'KeyD', action: 'right' },

            { code: 'ArrowUp', action: 'up' },
            { code: 'ArrowLeft', action: 'left' },
            { code: 'ArrowDown', action: 'down' },
            { code: 'ArrowRight', action: 'right' },

            { code: 'KeyR', action: 'toggleRecord' },
        ));
    }
}

const gameElement = document.querySelector('#game');
const debugElement = document.querySelector('#debug');
const inputManager = new InputManager(new MyInputStates(), new MyInputKeyMap());

const game = new Game(gameElement, debugElement, inputManager);
game.start();
