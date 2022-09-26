import './css/main.css';
import { Game } from './Game';
import { InputManager } from './InputManager';
import { IInputStates } from './IInputStates';
import { IInputKeyMap } from './IInputKeyMap';

class MyInputStates extends IInputStates {
    // Keyboard
    public up = false;
    public down = false;
    public left = false;
    public right = false;

    // Misc
    public toggleRecord = false;
}

class MyInputKeyMap extends IInputKeyMap {
    protected keyMap = {
        ArrowUp: 'up',    // ↑
        ArrowDown: 'down',  // ↓
        ArrowLeft: 'left',  // ←
        ArrowRight: 'right', // →

        KeyW: 'up',    // W
        KeyS: 'down',  // S
        KeyA: 'left',  // A
        KeyD: 'right', // D

        KeyR: 'toggleRecord', // R
    }
}

const gameElement = document.querySelector('#game');
const debugElement = document.querySelector('#debug');

const inputStates = new MyInputStates();
const inputKeyMap = new MyInputKeyMap();
const inputManager = new InputManager(inputStates, inputKeyMap);

const game = new Game(gameElement, debugElement, inputManager);
game.start();
