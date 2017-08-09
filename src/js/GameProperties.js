import * as THREE from 'three';

class GameProperties {
    //*
    static get GameSize()            { return 900; }
    /*/
    static get GameSize()            { return 64; }
    //*/
    static get CameraMovementSpeed() { return 200.0; }
    static get CameraOffset()        { return new THREE.Vector3(0, 400, 200); }
    static get RenderTextureSize()   { return 512; }
    static get ButtonTimeout()       { return 0.25; }

    static get PlayerAcceleration()  { return 100.0; }
    static get PlayerTurnSpeed()     { return 2.0; }
}

export default GameProperties;