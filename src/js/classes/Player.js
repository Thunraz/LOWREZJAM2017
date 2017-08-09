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

        this.acceleration = new THREE.Vector3();
    }

    update(dt) {
        this.handleControls(this.game.controls.states, dt);

        this.position.x += this.acceleration.x;
        this.position.z += this.acceleration.z;

        // Bop around in the water
        this.cube.position.y = -0.5 * Math.sin(2 * this.game.runTime) + 1.5 * Math.sin(3 * this.game.runTime) + 0.5;
        this.cube.rotation.z = Math.sin(1.5 * this.game.runTime) * 0.1;

        this.acceleration.multiplyScalar(0.9);
    }

    handleControls(states, dt) {
        if(states.up) {
            this.acceleration.x = -Math.sin(this.rotation.y) * GP.PlayerAcceleration * dt;
            this.acceleration.z = -Math.cos(this.rotation.y) * GP.PlayerAcceleration * dt;
        }
        else if(states.down) {
            this.acceleration.x = Math.sin(this.rotation.y) * GP.PlayerAcceleration * dt;
            this.acceleration.z = Math.cos(this.rotation.y) * GP.PlayerAcceleration * dt;
        }

        if(states.left) {
            this.rotation.y += GP.PlayerTurnSpeed * dt;
        }
        else if(states.right) {
            this.rotation.y -= GP.PlayerTurnSpeed * dt;
        }
    }
}

export default Player;