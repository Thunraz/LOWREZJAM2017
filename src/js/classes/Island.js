import * as THREE from 'three';

import Terrain from './Terrain.js';

class Island extends THREE.Object3D {
    constructor() {
        super();

        this.terrain = new Terrain(6);
        this.terrain.generate(0.7);

        let heightScale = 0.5;

        let geometry = new THREE.PlaneGeometry(1000, 1000, this.terrain.size - 1, this.terrain.size - 1);
        geometry.rotateX(-Math.PI / 2);
        for(let y = 0; y < this.terrain.size; y++) {
            for(let x = 0; x < this.terrain.size; x++) {
                let height = this.terrain.get(x, y) * heightScale;

                geometry.vertices[x + y * this.terrain.size].y = height;
            }
        }

        let material = new THREE.MeshStandardMaterial({ color: 0xc2b280 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.add(this.mesh);
    }
}

export default Island;