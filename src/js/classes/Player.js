import * as THREE from 'three';

import GP from '../GameProperties';

class Player extends THREE.Object3D {
    constructor(game) {
        super();

        this.game = game;

        let geometry = new THREE.BoxGeometry(20, 20, 20);
        let material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        this.cube    = new THREE.Mesh(geometry, material);
        this.cube.position.set(0, 0, 0);
        this.add(this.cube);
    }

    update(dt) {
        this.handleControls(this.game.controls.states, dt);

        this.cube.position.y = -0.5 * Math.sin(2 * this.game.runTime) + 1.5 * Math.sin(3 * this.game.runTime) + 0.5;
    }

    handleControls(states, dt) {
        if(states.up) {
            this.position.z -= GP.CameraMovementSpeed * dt;
        }
        else if(states.down) {
            this.position.z += GP.CameraMovementSpeed * dt;
        }

        if(states.left) {
            this.position.x -= GP.CameraMovementSpeed * dt;
        }
        else if(states.right) {
            this.position.x += GP.CameraMovementSpeed * dt;
        }
    }
}

export default Player;