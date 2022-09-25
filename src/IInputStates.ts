export abstract class IInputStates {
    // Mouse
    public leftMouseJustClicked = false;
    public leftMouseJustUp = false;
    public leftMouseJustDown = false;
    public leftMouseUp = true;
    public leftMouseDown = false;

    // Keyboard
    public up = false;
    public down = false;
    public left = false;
    public right = false;
    public movementX = 0.0;
    public movementY = 0.0;

    public toggleRecord = false;
}
