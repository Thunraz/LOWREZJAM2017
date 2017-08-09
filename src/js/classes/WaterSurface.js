import * as THREE from 'three';

import GP from '../GameProperties.js';

class WaterSurface extends THREE.Object3D {
    constructor(game) {
        super();

        this.game   = game;
        this.offset = new THREE.Vector2(0.0, 0.0);

        let surfaceGeometry = new THREE.PlaneGeometry(600, 800, 1, 1);
        surfaceGeometry.rotateX(-Math.PI/2)
        let surfaceMaterial = new THREE.MeshStandardMaterial({
            color: 0x66ccff
        });

        this.surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
        this.add(this.surface);
    }

    update(dt) {
        //this.mirror.
    }

}

export default WaterSurface;