import * as THREE from 'three';

import GP from '../GameProperties.js';

class WaterSurface extends THREE.Object3D {
    constructor(game) {
        super();

        this.game   = game;
        this.offset = new THREE.Vector2(0.0, 0.0);

        this.mirrorOpts = {
            mirrorPlane        : new THREE.Plane(),
            normal             : new THREE.Vector3(),
            mirrorWorldPosition: new THREE.Vector3(),
            cameraWorldPosition: new THREE.Vector3(),
            rotationMatrix     : new THREE.Matrix4(),
            lookAtPosition     : new THREE.Vector3(0, 0, -1),
            clipPlane          : new THREE.Vector4(),
            
            clipBias           : 0.0,
            mirrorColor        : new THREE.Color(0x7f7f7f),
            
            textureWidth       : 512,
            textureHeight      : 512,
            
            view               : new THREE.Vector3(),
            target             : new THREE.Vector3(),
            q                  : new THREE.Vector4(),
        };

        this.mirrorCamera  = new THREE.PerspectiveCamera();
        this.textureMatrix = new THREE.Matrix4();
        this.renderTarget  = new THREE.WebGLRenderTarget(
            this.mirrorOpts.textureWidth,
            this.mirrorOpts.textureHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                stencilBuffer: false
            }
        );

        if(!THREE.Math.isPowerOfTwo(this.mirrorOpts.textureWidth)
        || !THREE.Math.isPowerOfTwo(this.mirrorOpts.textureHeight)) {
            this.renderTarget.texture.generateMipmaps = false;
        }

        this.uniforms = {
            mirrorColor:   { value: this.mirrorOpts.mirrorColor },
            mirrorSampler: { value: null },
            textureMatrix: { value: new THREE.Matrix4() }
        };
        
        this.material = new THREE.ShaderMaterial({
            fragmentShader: document.getElementById('water-surface-frag').textContent,
            vertexShader:   document.getElementById('water-surface-vert').textContent,
            uniforms:       this.uniforms
        });
        
        this.material.uniforms.mirrorSampler.value = this.renderTarget.texture;
        this.material.uniforms.mirrorColor.value   = this.mirrorOpts.mirrorColor;
        this.material.uniforms.textureMatrix.value = this.textureMatrix;

        let geometry = new THREE.PlaneGeometry(200, 200, 32);
        geometry.rotateX(-Math.PI / 2);
        this.plane = new THREE.Mesh(geometry, this.material);
        this.add(this.plane);
    }

    update(dt) {
        this.updateTextureMatrix(this.game.camera);
        this.visible = false;

        // Save renderer's current values
        let currentRenderTarget     = this.game.renderer.getRenderTarget();
        let currentShadowAutoUpdate = this.game.renderer.shadowMap.autoUpdate;

        this.game.renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows
        this.game.renderer.render(this.game.scene, this.mirrorCamera, this.game.renderTarget, true);
        this.game.renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
        this.game.renderer.setRenderTarget( currentRenderTarget );

        this.visible = true;

    }

    updateTextureMatrix(camera) {
        this.updateMatrixWorld();

        this.mirrorOpts.mirrorWorldPosition.setFromMatrixPosition(this.matrixWorld);
        this.mirrorOpts.cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
        
        this.mirrorOpts.rotationMatrix.extractRotation(this.matrixWorld);
        
        this.mirrorOpts.normal.set(0, 0, 1);
        this.mirrorOpts.normal.applyMatrix4(this.mirrorOpts.rotationMatrix);

        this.mirrorOpts.view.subVectors(this.mirrorOpts.mirrorWorldPosition, this.mirrorOpts.cameraWorldPosition);
        this.mirrorOpts.view.reflect(this.mirrorOpts.normal).negate();
        this.mirrorOpts.view.add(this.mirrorOpts.mirrorWorldPosition);

        this.mirrorOpts.rotationMatrix.extractRotation(camera.matrixWorld);

        this.mirrorOpts.lookAtPosition.set(0, 0, -1);
        this.mirrorOpts.lookAtPosition.applyMatrix4(this.mirrorOpts.rotationMatrix);
        this.mirrorOpts.lookAtPosition.add(this.mirrorOpts.mirrorWorldPosition);

        this.mirrorCamera.position.copy(this.mirrorOpts.view);
        this.mirrorCamera.up.set(0, -1, 0);
        this.mirrorCamera.up.applyMatrix4(this.mirrorOpts.rotationMatrix);
        this.mirrorCamera.up.reflect(this.mirrorOpts.normal).negate();
        this.mirrorCamera.lookAt(this.mirrorOpts.target);

        this.mirrorCamera.near = camera.near;
        this.mirrorCamera.far  = camera.far;

        this.mirrorCamera.updateMatrixWorld();
        this.mirrorCamera.updateProjectionMatrix();

        // Update the texture matrix
        this.textureMatrix.set(
            0.5, 0.0, 0.0, 0.5,
            0.0, 0.5, 0.0, 0.5,
            0.0, 0.0, 0.5, 0.5,
            0.0, 0.0, 0.0, 1.0
        );

        this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix);
        this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse);

        // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
        // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
        this.mirrorOpts.mirrorPlane.setFromNormalAndCoplanarPoint(this.mirrorOpts.normal, this.mirrorOpts.mirrorWorldPosition);
        this.mirrorOpts.mirrorPlane.applyMatrix4(this.mirrorCamera.matrixWorldInverse);

        this.mirrorOpts.clipPlane.set(
            this.mirrorOpts.mirrorPlane.normal.x,
            this.mirrorOpts.mirrorPlane.normal.y,
            this.mirrorOpts.mirrorPlane.normal.z,
            this.mirrorOpts.mirrorPlane.constant
        );

        let projectionMatrix = this.mirrorCamera.projectionMatrix;

        this.mirrorOpts.q.x = (Math.sign(this.mirrorOpts.clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
        this.mirrorOpts.q.y = (Math.sign(this.mirrorOpts.clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
        this.mirrorOpts.q.z = -1.0;
        this.mirrorOpts.q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

        // Calculate the scaled plane vector
        this.mirrorOpts.clipPlane.multiplyScalar(2.0 / this.mirrorOpts.clipPlane.dot(this.mirrorOpts.q));

        // Replacing the third row of the projection matrix
        projectionMatrix.elements[2]  = this.mirrorOpts.clipPlane.x;
        projectionMatrix.elements[6]  = this.mirrorOpts.clipPlane.y;
        projectionMatrix.elements[10] = this.mirrorOpts.clipPlane.z + 1.0 - this.mirrorOpts.clipBias;
        projectionMatrix.elements[14] = this.mirrorOpts.clipPlane.w;
    }

}

export default WaterSurface;