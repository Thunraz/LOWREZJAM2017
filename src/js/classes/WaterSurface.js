import * as THREE from 'three';

import GP from '../GameProperties.js';

class WaterSurface extends THREE.Object3D {
    constructor(game) {
        super();

        this.game   = game;

        this.offset = new THREE.Vector2(0.0, 0.0);

        let geometry = new THREE.PlaneGeometry(200, 200, 32);
        geometry.rotateX(-Math.PI / 2);

        this.uniforms = {
            time:       { value: 1.0 },
            resolution: { value: new THREE.Vector2(GP.GameSize) },
            uPosition:  { value: new THREE.Vector3(0) }
        };
        
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,

            vertexShader: document.getElementById('water-surface-vert').textContent,
            fragmentShader: document.getElementById('water-surface-frag').textContent,
        });
        
        this.plane = new THREE.Mesh(geometry, this.material);

        this.add(this.plane);
    }

    update(dt) {
        this.uniforms.time.value = this.game.runTime;
        this.uniforms.uPosition.value.set(
            10 / Math.abs(this.position.x),
            Math.abs(this.position.y),
            10 / Math.abs(this.position.z)
        );
    }

}

export default WaterSurface;