import * as THREE from 'three';

import GP from '../GameProperties.js';

class WaterSurface extends THREE.Object3D {
    constructor(game) {
        super();

        this.game   = game;
        this.offset = new THREE.Vector2(0.0, 0.0);

        let textureSize = 512;
        this.mirrorCamera = new THREE.PerspectiveCamera(
            this.game.camera.fov,
            this.game.camera.aspect,
            this.game.camera.near,
            this.game.camera.far
        );
        this.mirrorCamera.position.set(
            this.game.camera.position.x,
            -this.game.camera.position.y,
            this.game.camera.position.z
        );
        this.mirrorCamera.rotation.set(
            -this.game.camera.rotation.x,
            this.game.camera.rotation.y,
            this.game.camera.rotation.z
        )
        this.add(this.mirrorCamera);

        this.renderTarget = new THREE.WebGLRenderTarget(
            textureSize,
            textureSize,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                stencilBuffer: false
            }
        );

        let cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
        let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00f0f0 });
        this.cube    = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cube.position.copy(this.mirrorCamera.position);
        this.cube.rotation.copy(this.mirrorCamera.rotation);
        this.add(this.cube);

        this.material = new THREE.MeshLambertMaterial({
            color: new THREE.Color(0xffffff),
            reflectivity: 1.0,
            map: this.renderTarget.texture
        });

        let geometry = new THREE.PlaneGeometry(200, 200, 32);
        geometry.rotateX(-Math.PI / 2);
        this.plane = new THREE.Mesh(geometry, this.material);
        this.add(this.plane);
    }

    update(dt) {
        this.visible = false;

        // Save renderer's current values
        let currentRenderTarget     = this.game.renderer.getRenderTarget();
        let currentShadowAutoUpdate = this.game.renderer.shadowMap.autoUpdate;

        this.game.renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows
        this.game.renderer.render(this.game.scene, this.mirrorCamera, this.renderTarget, true);

        if(!this.yo) {
            this.yo = true;
            console.log(currentRenderTarget);
        }
        
        // Restore saved values
        this.game.renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
        this.game.renderer.setRenderTarget(currentRenderTarget);

        this.visible = true;
    }

}

export default WaterSurface;