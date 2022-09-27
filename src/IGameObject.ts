import { Object3D } from 'three';
import { IInputStates } from './IInputStates';

export abstract class IGameObject extends Object3D {
    public abstract update(dt: number, inputStates: IInputStates): void;
}
