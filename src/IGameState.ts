import { Renderer } from 'three';

export interface IGameState {
    get runtime(): number;

    render(renderer: Renderer): void;

    update(dt: number): void;
}
