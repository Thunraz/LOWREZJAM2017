import { IInputStates } from './IInputStates';

export interface IInputManager {
    get states(): IInputStates;

    get enabled(): boolean;

    update(): void;
}
