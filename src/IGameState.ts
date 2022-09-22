export interface IGameState {
    update(dt: number): void;
    draw(): void;
}
