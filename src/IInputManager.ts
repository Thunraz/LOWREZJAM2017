import { IInputStates } from './IInputStates';

export interface IInputManager<TInputStates extends IInputStates> {
    get states(): TInputStates;

    get enabled(): boolean;

    update(): void;
}
