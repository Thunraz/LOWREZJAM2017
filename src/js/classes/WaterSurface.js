import * as THREE from 'three';

class WaterSurface extends THREE.Object3D {
    constructor(game) {
        super();

        this.game   = game;
        this.scene  = game.scene;
        this.camera = game.camera;

        this.offset = new THREE.Vector2(0.0, 0.0);

        let geometry = new THREE.PlaneGeometry(200, 200, 32);
        geometry.rotateX(-Math.PI / 2);
        
        let material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        
        this.plane = new THREE.Mesh(geometry, material);
        this.scene.add(this.plane);
    }

    update(dt) {
        this.plane.position.set(this.position.x, this.position.y, this.position.z);
    }

}

export default WaterSurface;