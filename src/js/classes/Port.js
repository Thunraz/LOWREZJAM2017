import * as THREE from 'three';

class Port extends THREE.Object3D {
    /**
     * Loads port mesh
     * @param {Game} game Game instance
     */
    constructor(game) {
        super();

        this.game = game;

        let scale = 15;

        let loader = new THREE.ObjectLoader();
        loader.load(
            'assets/models/port.json',
            (mesh) => {
                this.port = mesh;
                this.port.castShadow    = true;
                this.port.receiveShadow = true;
                this.port.scale.set(scale, scale, scale);
                this.add(this.port);
            }
        );

        this.rotateY(-Math.PI/2)
    }
}

export default Port;