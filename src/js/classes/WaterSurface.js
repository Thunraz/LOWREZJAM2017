import * as THREE from 'three';

import GP from '../GameProperties.js';

class WaterSurface extends THREE.Object3D {
    constructor(game) {
        super();

        this.game   = game;
        this.offset = new THREE.Vector2(0.0, 0.0);

        let textureLoader = new THREE.TextureLoader();
        this.tex1 = textureLoader.load('assets/img/water-bump-1.png');
        this.tex2 = textureLoader.load('assets/img/water-bump-2.png');
        this.tex3 = textureLoader.load('assets/img/water-bump-3.png');
        this.tex4 = textureLoader.load('assets/img/water-bump-4.png');

        let surfaceGeometry = new THREE.PlaneGeometry(600, 800, 1, 1);
        surfaceGeometry.rotateX(-Math.PI / 2)
        let surfaceMaterial = new THREE.MeshStandardMaterial({
            color: 0x66aadd,
        });
        this.surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
        this.add(this.surface);

        this.waves = [];
        for(let i = 0; i < 4; i++) {
            let texture;
            switch(i) {
            case 0: texture = this.tex1; break;
            case 1: texture = this.tex2; break;
            case 2: texture = this.tex3; break;
            case 3: texture = this.tex4; break;
            } 

            let waveGeometry = new THREE.PlaneGeometry(600, 800, 1, 1);
            waveGeometry.rotateX(-Math.PI / 2);
            let waveMaterial = new THREE.MeshStandardMaterial({
                color: 0xb3f7ff,
                opacity: 0.0,
                alphaMap: texture,
                transparent: true,
                bumpMap: texture
            });
            this.waves.push(new THREE.Mesh(waveGeometry, waveMaterial));
            this.add(this.waves[i]);
            this.waves[i].position.y = .1;
        }
    }

    update(dt) {
        for(let i = 0; i < this.waves.length; i++) {
            this.waves[i].material.opacity = (Math.sin((this.game.runTime + i) * 10) + 1) / 6;
        }
    }

}

export default WaterSurface;