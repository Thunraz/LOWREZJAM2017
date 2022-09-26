export abstract class IInputKeyMap {
    protected abstract keyMap;

    public getActionForKey(key: string) {
        return this.keyMap[key];
    }
}
