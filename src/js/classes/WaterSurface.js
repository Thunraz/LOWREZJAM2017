import * as THREE from 'three';

import GP from '../GameProperties.js';

class WaterSurface extends THREE.Object3D {
    constructor(game) {
        super();

        this.game   = game;

        this.offset = new THREE.Vector2(0.0, 0.0);

        let geometry = new THREE.PlaneGeometry(200, 200, 32);
        geometry.rotateX(-Math.PI / 2);
        
        this.material = new THREE.MeshStandardMaterial({
            color: 0x737373
        });
        this.plane = new THREE.Mesh(geometry, this.material);

        this.add(this.plane);
    }

    update(dt) {

    }

}

export default WaterSurface;