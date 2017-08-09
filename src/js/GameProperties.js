import * as THREE from 'three';

class GameProperties {
    /*
    static get GameSize()            { return 900; }
    /*/
    static get GameSize()            { return 64; }
    //*/
    static get CameraMovementSpeed() { return 200.0; }
    static get CameraOffset()        { return new THREE.Vector3(0, 200, 100); }
    static get RenderTextureSize()   { return 512; }
    static get ButtonTimeout()       { return 0.25; }

    static get SunPosition()        { return new THREE.Vector3(300, 300, -100); }

    static get PlayerAcceleration()  { return 1.0; }
    static get PlayerTurnSpeed()     { return 1.0; }
}

export default GameProperties;