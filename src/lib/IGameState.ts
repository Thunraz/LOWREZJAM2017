import { Renderer } from 'three';
import { IInputStates } from './IInputStates';
import { Game } from './Game';

export interface IGameState {
    start(game: Game);

    update(dt: number, inputStates: IInputStates): void;

    render(renderer: Renderer): void;

    get runtime(): number;
}
