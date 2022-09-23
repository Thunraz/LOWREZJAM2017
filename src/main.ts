import './css/main.css';
import { Game } from './Game';

const gameElement = document.querySelector('#game');
const debugElement = document.querySelector('#debug');
const game = new Game(gameElement, debugElement);
game.start();
