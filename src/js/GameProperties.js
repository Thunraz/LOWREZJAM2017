import * as THREE from 'three';

class GameProperties {
    static get GameSize()            { return 640; }
    static get CameraMovementSpeed() { return 200.0; }
    static get CameraOffset()        { return new THREE.Vector3(0, 400, 200); }
    static get RTTextureWidth()      { return 512; }
    static get RTTextureHeight()     { return this.RTTextureWidth; }
}

export default GameProperties;