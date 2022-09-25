import { Object3D } from 'three';

export abstract class IGameObject extends Object3D {
    public abstract update(dt: number, inputStates): void;
}
