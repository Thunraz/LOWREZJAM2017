export type TCodeActionMap = { code: string, action: string };

export abstract class IInputKeyMap {
    private readonly _keyMap: Map<string, string> = new Map<string, string>();

    /**
     * Assign a single action to a key
     * @param {string} code the key
     * @param {string} action the action
     * @returns {void}
     */
    public assignAction(code: string, action: string): void {
        this._keyMap.set(code, action);
    }

    /**
     * Assign multiple actions to keys
     * @param {Array<TCodeActionMap>} actionMappings an array of codes mapped to actions
     * @returns {void}
     */
    public assignActions(actionMappings: Array<TCodeActionMap>): void {
        actionMappings.forEach((actionMap) => {
            this.assignAction(actionMap.code, actionMap.action);
        });
    }

    /**
     * Remove an action from a key
     * @param {string} code the code of the key to remove the action from
     * @returns {void}
     */
    public removeActionFromKey(code: string): void {
        this._keyMap.delete(code);
    }

    /**
     * Removes all key assignments for a specific action
     * @param {string} action the action to remove all assignments for
     * @returns {void}
     */
    public removeActionFromAllKeys(action: string): void {
        const codes = [];
        this._keyMap.forEach((a, c) => {
            if (a === action) {
                codes.push(c);
            }
        });

        for (let i = 0; i != codes.length; ++i) {
            this.removeActionFromKey(codes[i]);
        }
    }

    /**
     * Returns the action for a key's code.
     * @param {string} code the code from @type {KeyboardEvent}. Make sure this is not `keyCode` or `which`
     * @returns {string} the action assigned to the key
     */
    public getActionForKey(code: string): string {
        const action = this._keyMap.get(code);
        if (action === undefined) {
            // eslint-disable-next-line no-console
            console.warn(`${this.constructor.name}: Action for code '${code}' is undefined`);
        }

        return action;
    }
}
