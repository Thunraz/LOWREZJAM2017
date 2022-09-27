import { Renderer } from 'three';
import { IInputStates } from './IInputStates';

export interface IGameState {
    get runtime(): number;

    render(renderer: Renderer): void;

    update(dt: number, inputStates: IInputStates): void;
}
