import { IInputStates } from './IInputStates';

export interface IInputManager<T extends IInputStates> {
    get states(): T;

    get enabled(): boolean;

    update(): void;
}
