import * as THREE from 'three';

import GP from '../GameProperties.js';

class WaterSurface extends THREE.Object3D {
    constructor(game) {
        super();

        this.game   = game;
        this.offset = new THREE.Vector2(0.0, 0.0);

        this.mirror = new THREE.Mirror(
            1200,
            1300,
            {
                clipBias: 0.003,
                textureWidth:  GP.RenderTextureSize * window.devicePixelRatio,
                textureHeight: GP.RenderTextureSize * window.devicePixelRatio,
                color: 0xcccccc
            }
        );
        this.mirror.position.set(0, 0, 0);
        this.mirror.rotateX(-Math.PI / 2);
        this.add(this.mirror);
    }

    update(dt) {
        //this.mirror.
    }

}

export default WaterSurface;