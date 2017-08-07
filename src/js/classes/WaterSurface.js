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
        
        this.material = new THREE.ShaderMaterial( {
            fragmentShader: document.getElementById('water-surface-frag').textContent,
            vertexShader:   document.getElementById('water-surface-vert').textContent,
            uniforms:       this.uniforms
        });
        this.material.uniforms.mirrorSampler.value = this.renderTarget.texture;
        this.material.uniforms.mirrorColor.value   = this.mirrorOpts.mirrorColor;
        this.material.uniforms.textureMatrix.value = this.textureMatrix;

        let geometry = new THREE.PlaneGeometry(200, 200, 32);
        geometry.rotateX(-Math.PI / 2);
        this.plane = new THREE.Mesh(geometry, material);
        this.add(this.plane);
    }

    update(dt) {
        this.updateTextureMatrix(this.game.camera);
    }

    updateTextureMatrix(camera) {
        
    }

}

export default WaterSurface;